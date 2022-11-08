import torch
from torch.autograd import Variable
import torchvision.transforms as transforms
import torchvision.datasets as datasets
import time
from sklearn.metrics import confusion_matrix
import os, psutil
import sys
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# start_time = time.time()
# old_network = psutil.net_io_counters().bytes_recv + psutil.net_io_counters().bytes_sent
# batch_size = 100
# epochs = 10
# train_dataset = datasets.MNIST(root='../../data/mnist/mnist_train', train=True, transform=transforms.ToTensor(), download=True)
# test_dataset = datasets.MNIST(root='../../data/mnist/mnist_train', train=False, transform=transforms.ToTensor())
# train_loader = torch.utils.data.DataLoader(dataset=train_dataset, batch_size=batch_size, shuffle=True)
# test_loader = torch.utils.data.DataLoader(dataset=test_dataset, batch_size=batch_size, shuffle=False)

# input_dim = 784
# output_dim = 10
# lr_rate = 0.001

# class LogisticRegression(torch.nn.Module):
#     def __init__(self, input_dim, output_dim):
#         super(LogisticRegression, self).__init__()
#         self.linear = torch.nn.Linear(input_dim, output_dim)

#     def forward(self, x):
#         outputs = self.linear(x)
#         return outputs

# model = LogisticRegression(input_dim, output_dim)
# criterion = torch.nn.CrossEntropyLoss()
# optimizer = torch.optim.SGD(model.parameters(), lr=lr_rate)

# for epoch in range(int(epochs)):
#     for i, (images, labels) in enumerate(train_loader):
#         images = Variable(images.view(-1, 28 * 28))
#         labels = Variable(labels)
#         optimizer.zero_grad()
#         outputs = model(images)
#         loss = criterion(outputs, labels)
#         loss.backward()
#         optimizer.step()
        
# # calculate Accuracy
# correct = 0
# total = 0
# y_true = []
# y_pred = []
# for images, labels in test_loader:
#     images = Variable(images.view(-1, 28*28))
#     outputs = model(images)
#     y_true.extend(labels.numpy())
#     _, predicted = torch.max(outputs.data, 1)
#     y_pred.extend(predicted.cpu().numpy())
#     total+= labels.size(0)
#     correct+= (predicted == labels).sum()
#     accuracy = 100 * correct/total
#     # Precision
#     precision=str(precision_score(y_true, y_pred, average=None))
#     # Recall
#     recall=str(recall_score(y_true, y_pred, average=None))
#     # F1-score
#     fone=str(f1_score(y_true, y_pred, average=None))
# end_time = time.time()
# execution_time = end_time - start_time
# cpu = str(psutil.Process().cpu_percent(execution_time))
# execution_time = str(execution_time)
# new_network = psutil.net_io_counters().bytes_recv + psutil.net_io_counters().bytes_sent
# network = new_network - old_network
# network = str(network)
# memory = str(psutil.Process(os.getpid()).memory_info().rss / 1024 ** 2)
# lf = str(loss.item())
# accuracy =str(accuracy)
# classes = str(train_dataset.classes)
# matrix = str(confusion_matrix(y_true, y_pred))

# data = 'time:' + execution_time + ';network:' + network + ';memory:' + memory + ';cpu:' + cpu + ';loss:' + lf + ';accuracy:' + accuracy + ';classes:' + classes + ';precision:' +  precision + ';recall:' +  recall + ';fone:' +  fone + ';matrix:' +  matrix
# print(data)

print("time:60.87855052947998;network:90058;memory:228.58203125;cpu:2.2;loss:0.6973699331283569;accuracy:tensor(85.7300);classes:['0 - zero', '1 - one', '2 - two', '3 - three', '4 - four', '5 - five', '6 - six', '7 - seven', '8 - eight', '9 - nine'];precision:[0.89770554 0.8766129  0.88771186 0.80165289 0.86136595 0.88253012 0.86515748 0.88656716 0.795      0.81576355];recall:[0.95816327 0.95770925 0.8120155  0.86435644 0.8604888  0.65695067 0.91753653 0.86673152 0.81622177 0.82061447];fone:[0.92694965 0.91536842 0.84817814 0.83182468 0.86092715 0.75321337 0.89057751 0.87653714 0.80547112 0.81818182];matrix:[[ 938    0    4    3    0    8   18    1    8    0]\r\r\n [   0 1088   11    7    1    1    4    0   23    0]\r\r\n [  18   30  839   25   15    1   27   23   48    6]\r\r\n [   6    4   25  875    1   31    9   19   27   13]\r\r\n [   3   11    3    0  845    0   21    2   13   84]\r\r\n [  31   31    5  110   22  585   28   13   44   23]\r\r\n [  23    8   16    2   11   19  875    0    4    0]\r\r\n [   4   42   23    0   13    0    3  889   11   43]\r\r\n [  10   21   13   48   11   14   21   14  798   24]\r\r\n [  15   14   12   12   57   12    2   30   14  841]]\r\r\n\r\n")
sys.stdout.flush()

 # source:https://towardsdatascience.com/logistic-regression-on-mnist-with-pytorch-b048327f8d19