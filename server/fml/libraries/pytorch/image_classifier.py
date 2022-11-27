import torch
import sys
# absolute path to utilities
sys.path.insert(0, 'C:\\Users\\ahmed.saidani\\Desktop\\FMLB\\server\\fml\\utils')
from models import MnistCnn,CifarCnn, MnistLogisticRegression
from data_loaders import MnistDataLoader, CifarDataLoader
from config import Config
import torch.optim as optim
import torch.nn as nn
import os, psutil
import time
from torch.autograd import Variable
from sklearn.metrics import precision_score, recall_score, f1_score

# declare the config, gpu, model, dataset, optimizer, and criterion
config = Config()
use_cuda = config.gpu and torch.cuda.is_available()
device = torch.device("cuda" if use_cuda else "cpu")

# supports both cifar (only cnn) and mnist dataset
if config.dataset =="CIFAR":
    dataloader = CifarDataLoader()
else:
    dataloader = MnistDataLoader()

# supports both logistic regression and cnn
if config.dataset =="CIFAR":
    model = CifarCnn().to(device)
elif config.model =="CNN":
    model = MnistCnn().to(device)
else:
    model = MnistLogisticRegression().to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), config.lr, momentum=0.9)

# define training
def train():
  for i in range(config.epochs):
    total_loss = 0
    total_acc = 0  
    for images,labels in dataloader.train_loader:
        if config.model =="CNN":
            images = images.to(device)
            labels = labels.to(device)
        else:
            images = Variable(images.view(-1, 28 * 28))
            labels = Variable(labels)
        optimizer.zero_grad()
        output = model(images)
        loss = criterion(output,labels)
        loss.backward()
        optimizer.step()
        total_loss+=loss.item()
        total_acc+=torch.sum(torch.max(output,dim=1)[1]==labels).item()*1.0     

# define testing
def test():
    total_loss = 0
    correct = 0
    total = 0
    y_true = []
    y_pred = []
    with torch.no_grad():
        for images,labels in dataloader.test_loader:
            if config.model =="CNN":
              images, labels = images, labels
            else:
              images = Variable(images.view(-1, 28*28))
              labels = Variable(labels)
            output = model(images)
            y_true.extend(labels.numpy())
            _, predicted = torch.max(output.data, 1)
            y_pred.extend(predicted.cpu().numpy())
            loss = criterion(output,labels)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            total_loss+=loss.item()      
    accuracy = str(100 * correct/total)
    total_loss = str(total_loss/total)
    precision=str(100 * sum(precision_score(y_true, y_pred, average=None))/len(dataloader.train_dataset.classes))
    recall=str(100 * sum(recall_score(y_true, y_pred, average=None))/len(dataloader.train_dataset.classes))
    fone=str(100 * sum(f1_score(y_true, y_pred, average=None))/len(dataloader.train_dataset.classes))
    return accuracy, total_loss, precision, recall, fone

# define benchmarking
def benchmark():
  # declare start time, cpu and network use at the begining 
  start_time = time.time()
  old_network = psutil.net_io_counters().bytes_recv + psutil.net_io_counters().bytes_sent
  old_cpu = psutil.cpu_percent(interval=None)
  train()
  accuracy, total_loss, precision, recall, fone = test()
  # scrape metrics
  execution_time = time.time() - start_time
  cpu = str(psutil.cpu_percent(interval=None))
  execution_time = str(execution_time)
  new_network = psutil.net_io_counters().bytes_recv + psutil.net_io_counters().bytes_sent
  network = str(new_network - old_network)
  memory = str(psutil.Process(os.getpid()).memory_info().rss / 1024 ** 2)
  if config.gpu == True:
    gpu = "1"
  else:
    gpu = "0"
  # log metrics
  data = '{ library: pytorch; \n accuracy: ' + accuracy + '; \n loss: ' + total_loss + '; \n recall: ' + recall + '; \n precision: ' + precision + '; \n f1: ' + fone + '; \n time: ' + execution_time + '; \n network: ' + network  + '; \n memory: ' +  memory + '; \n cpu: ' +  cpu + '; \n gpu: ' +  gpu +"; \n }"
  print(data)
  sys.stdout.flush()

# run
benchmark()