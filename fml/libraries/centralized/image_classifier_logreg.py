import torch
from torch.autograd import Variable
import torchvision.transforms as transforms
import torchvision.datasets as datasets
import time
import os, psutil
import sys
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix



# declare start time and network use at the begining 
start_time = time.time()
old_network = psutil.net_io_counters().bytes_recv + psutil.net_io_counters().bytes_sent
old_cpu = psutil.cpu_percent(interval=None)
# declare parameters 
batch_size = 30
epochs = 1

# load datasets
train_dataset = datasets.MNIST(root='../../data/mnist/mnist_train', train=True, transform=transforms.ToTensor(), download=True)
test_dataset = datasets.MNIST(root='../../data/mnist/mnist_train', train=False, transform=transforms.ToTensor())
train_loader = torch.utils.data.DataLoader(dataset=train_dataset, batch_size=batch_size, shuffle=True)
test_loader = torch.utils.data.DataLoader(dataset=test_dataset, batch_size=batch_size, shuffle=False)

# declare learning rate and model dimensions
input_dim = 784
output_dim = 10
lr_rate = 0.01

# train
class LogisticRegression(torch.nn.Module):
    def __init__(self, input_dim, output_dim):
        super(LogisticRegression, self).__init__()
        self.linear = torch.nn.Linear(input_dim, output_dim)

    def forward(self, x):
        outputs = self.linear(x)
        return outputs

# declare model
model = LogisticRegression(input_dim, output_dim)
criterion = torch.nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=lr_rate)

# train
for epoch in range(int(epochs)):
    for i, (images, labels) in enumerate(train_loader):
        images = Variable(images.view(-1, 28 * 28))
        labels = Variable(labels)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
# calculate Accuracy
correct = 0
total = 0
y_true = []
y_pred = []
for images, labels in test_loader:
    images = Variable(images.view(-1, 28*28))
    outputs = model(images)
    y_true.extend(labels.numpy())
    _, predicted = torch.max(outputs.data, 1)
    y_pred.extend(predicted.cpu().numpy())
    total+= labels.size(0)
    correct+= (predicted == labels).sum()
    accuracy = 100 * correct/total
    # Precision
    precision=str(precision_score(y_true, y_pred, average=None))
    # Recall
    recall=str(recall_score(y_true, y_pred, average=None))
    # F1-score
    fone=str(f1_score(y_true, y_pred, average=None))

# scrape metrics
end_time = time.time()
execution_time = end_time - start_time
cpu = str(psutil.cpu_percent(interval=None))
execution_time = str(execution_time)
new_network = psutil.net_io_counters().bytes_recv + psutil.net_io_counters().bytes_sent
network = new_network - old_network
network = str(network)
memory = str(psutil.Process(os.getpid()).memory_info().rss / 1024 ** 2)
lf = str(loss.item())
accuracy =str(accuracy)
accuracy = accuracy[7:13]
classes = str(train_dataset.classes)
matrix = str(confusion_matrix(y_true, y_pred))

# log metrics
data = ';time:' + execution_time + ';network:' + network + ';memory:' + memory + ';cpu:' + cpu + ';loss:' + lf + ';accuracy:' + accuracy + ';classes:' + classes + ';precision:' +  precision + ';recall:' +  recall + ';fone:' +  fone + ';matrix:' +  matrix
print(data)
sys.stdout.flush()

 # source:https://towardsdatascience.com/logistic-regression-on-mnist-with-pytorch-b048327f8d19