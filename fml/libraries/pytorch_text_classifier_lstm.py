
import torch
from torch import nn
import numpy as np
from torchtext import data
from torchtext.vocab import Vectors
import spacy
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score
import torch.optim as optim
import sys

class Config(object):
    embed_size = 300
    hidden_layers = 2
    hidden_size = 32
    bidirectional = True
    output_size = 4
    max_epochs = 10
    lr = 0.25
    batch_size = 64
    max_sen_len = 20 # Sequence length for RNN
    dropout_keep = 0.8

class Dataset(object):
    def __init__(self, config):
        self.config = config
        self.train_iterator = None
        self.test_iterator = None
        self.val_iterator = None
        self.vocab = []
        self.word_embeddings = {}
    
    def parse_label(self, label):
        '''
        Get the actual labels from label string
        Input:
            label (string) : labels of the form '__label__2'
        Returns:
            label (int) : integer value corresponding to label string
        '''
        return int(label.strip()[1])

    def get_pandas_df(self, filename):
        '''
        Load the data into Pandas.DataFrame object
        This will be used to convert data to torchtext object
        '''
        with open(filename, 'r') as datafile:     
            data = [line.strip().split(',', maxsplit=1) for line in datafile]
            data_text = list(map(lambda x: x[1], data))
            data_label = list(map(lambda x: self.parse_label(x[0]), data))

        full_df = pd.DataFrame({"text":data_text, "label":data_label})
        return full_df
    
    def load_data(self, w2v_file, train_file, test_file, val_file=None):
        '''
        Loads the data from files
        Sets up iterators for training, validation and test data
        Also create vocabulary and word embeddings based on the data
        
        Inputs:
            w2v_file (String): absolute path to file containing word embeddings (GloVe/Word2Vec)
            train_file (String): absolute path to training file
            test_file (String): absolute path to test file
            val_file (String): absolute path to validation file
        '''

        NLP = spacy.load('en_core_web_sm')
        tokenizer = lambda sent: [x.text for x in NLP.tokenizer(sent) if x.text != " "]
        
        # Creating Field for data
        TEXT = data.Field(sequential=True, tokenize=tokenizer, lower=True, fix_length=self.config.max_sen_len)
        LABEL = data.Field(sequential=False, use_vocab=False)
        datafields = [("text",TEXT),("label",LABEL)]
        
        # Load data from pd.DataFrame into torchtext.data.Dataset
        train_df = self.get_pandas_df(train_file)
        train_examples = [data.Example.fromlist(i, datafields) for i in train_df.values.tolist()]
        train_data = data.Dataset(train_examples, datafields)
        
        test_df = self.get_pandas_df(test_file)
        test_examples = [data.Example.fromlist(i, datafields) for i in test_df.values.tolist()]
        test_data = data.Dataset(test_examples, datafields)
        
        # If validation file exists, load it. Otherwise get validation data from training data
        if val_file:
            val_df = self.get_pandas_df(val_file)
            val_examples = [data.Example.fromlist(i, datafields) for i in val_df.values.tolist()]
            val_data = data.Dataset(val_examples, datafields)
        else:
            train_data, val_data = train_data.split(split_ratio=0.8)
        
        TEXT.build_vocab(train_data, vectors=Vectors(w2v_file))
        self.word_embeddings = TEXT.vocab.vectors
        self.vocab = TEXT.vocab
        
        self.train_iterator = data.BucketIterator(
            (train_data),
            batch_size=self.config.batch_size,
            sort_key=lambda x: len(x.text),
            repeat=False,
            shuffle=True)
        
        self.val_iterator, self.test_iterator = data.BucketIterator.splits(
            (val_data, test_data),
            batch_size=self.config.batch_size,
            sort_key=lambda x: len(x.text),
            repeat=False,
            shuffle=False)
        
        print ("Loaded {} training examples".format(len(train_data)))
        print ("Loaded {} test examples".format(len(test_data)))
        print ("Loaded {} validation examples".format(len(val_data)))


def evaluate_model(model, iterator):
    all_preds = []
    all_y = []
    for idx,batch in enumerate(iterator):
        if torch.cuda.is_available():
            x = batch.text.cuda()
        else:
            x = batch.text
        y_pred = model(x)
        predicted = torch.max(y_pred.cpu().data, 1)[1] + 1
        all_preds.extend(predicted.numpy())
        all_y.extend(batch.label.numpy())
    score = accuracy_score(all_y, np.array(all_preds).flatten())
    return score

class TextRNN(nn.Module):
    def __init__(self, config, vocab_size, word_embeddings):
        super(TextRNN, self).__init__()
        self.config = config
        
        # Embedding Layer
        self.embeddings = nn.Embedding(vocab_size, self.config.embed_size)
        self.embeddings.weight = nn.Parameter(word_embeddings, requires_grad=False)
        
        self.lstm = nn.LSTM(input_size = self.config.embed_size,
                            hidden_size = self.config.hidden_size,
                            num_layers = self.config.hidden_layers,
                            dropout = self.config.dropout_keep,
                            bidirectional = self.config.bidirectional)
        
        self.dropout = nn.Dropout(self.config.dropout_keep)
        
        # Fully-Connected Layer
        self.fc = nn.Linear(
            self.config.hidden_size * self.config.hidden_layers * (1+self.config.bidirectional),
            self.config.output_size
        )
        
        # Softmax non-linearity
        self.softmax = nn.Softmax()
        
    def forward(self, x):
        # x.shape = (max_sen_len, batch_size)
        embedded_sent = self.embeddings(x)
        # embedded_sent.shape = (max_sen_len=20, batch_size=64,embed_size=300)

        lstm_out, (h_n,c_n) = self.lstm(embedded_sent)
        final_feature_map = self.dropout(h_n) # shape=(num_layers * num_directions, 64, hidden_size)
        
        # Convert input to (64, hidden_size * hidden_layers * num_directions) for linear layer
        final_feature_map = torch.cat([final_feature_map[i,:,:] for i in range(final_feature_map.shape[0])], dim=1)
        final_out = self.fc(final_feature_map)
        return self.softmax(final_out)
    
    def add_optimizer(self, optimizer):
        self.optimizer = optimizer
        
    def add_loss_op(self, loss_op):
        self.loss_op = loss_op
    
    def reduce_lr(self):
        print("Reducing LR")
        for g in self.optimizer.param_groups:
            g['lr'] = g['lr'] / 2
                
    def run_epoch(self, train_iterator, val_iterator, epoch):
        train_losses = []
        val_accuracies = []
        losses = []
        
        # Reduce learning rate as number of epochs increase
        if (epoch == int(self.config.max_epochs/3)) or (epoch == int(2*self.config.max_epochs/3)):
            self.reduce_lr()
            
        for i, batch in enumerate(train_iterator):
            self.optimizer.zero_grad()
            if torch.cuda.is_available():
                x = batch.text.cuda()
                y = (batch.label - 1).type(torch.cuda.LongTensor)
            else:
                x = batch.text
                y = (batch.label - 1).type(torch.LongTensor)
            y_pred = self.__call__(x)
            loss = self.loss_op(y_pred, y)
            loss.backward()
            losses.append(loss.data.cpu().numpy())
            self.optimizer.step()
    
            if i % 100 == 0:
                print("Iter: {}".format(i+1))
                avg_train_loss = np.mean(losses)
                train_losses.append(avg_train_loss)
                print("\tAverage training loss: {:.5f}".format(avg_train_loss))
                losses = []
                
                # Evalute Accuracy on validation set
                val_accuracy = evaluate_model(self, val_iterator)
                print("\tVal Accuracy: {:.4f}".format(val_accuracy))
                self.train()
                
        return train_losses, val_accuracies

if __name__=='__main__':
    config = Config()
    train_file = '../../data/ag_news/train.csv'
    if len(sys.argv) > 2:
        train_file = sys.argv[1]
    test_file = '../../data/ag_news/test.csv'
    if len(sys.argv) > 3:
        test_file = sys.argv[2]
    
    w2v_file = '../../data/ag_news/glove.840B.300d.txt'
    
    dataset = Dataset(config)
    dataset.load_data(w2v_file, train_file, test_file)
    
    # Create Model with specified optimizer and loss function
    ##############################################################
    model = TextRNN(config, len(dataset.vocab), dataset.word_embeddings)
    if torch.cuda.is_available():
        model.cuda()
    model.train()
    optimizer = optim.SGD(model.parameters(), lr=config.lr)
    NLLLoss = nn.NLLLoss()
    model.add_optimizer(optimizer)
    model.add_loss_op(NLLLoss)
    ##############################################################
    
    train_losses = []
    val_accuracies = []
    
    for i in range(config.max_epochs):
        print ("Epoch: {}".format(i))
        train_loss,val_accuracy = model.run_epoch(dataset.train_iterator, dataset.val_iterator, i)
        train_losses.append(train_loss)
        val_accuracies.append(val_accuracy)

    train_acc = evaluate_model(model, dataset.train_iterator)
    val_acc = evaluate_model(model, dataset.val_iterator)
    test_acc = evaluate_model(model, dataset.test_iterator)

    print ('Final Training Accuracy: {:.4f}'.format(train_acc))
    print ('Final Validation Accuracy: {:.4f}'.format(val_acc))
    print ('Final Test Accuracy: {:.4f}'.format(test_acc))