import torch
import torch.nn as nn
import torch.nn.functional as F

# Declare models

# CNN for MNIST
class MnistCnn(nn.Module):
  def __init__(self):
    super(MnistCnn,self).__init__()
    self.conv1 = nn.Conv2d(1,10,kernel_size=5,stride=1)
    self.conv2 = nn.Conv2d(10,10,kernel_size=5,stride=1)
    self.pool = nn.MaxPool2d(kernel_size=2,stride=2) #2x2 maxpool
    self.fc1 = nn.Linear(4*4*10,100)
    self.fc2 = nn.Linear(100,10)
  
  def forward(self,x):
    x = F.relu(self.conv1(x)) #24x24x10
    x = self.pool(x) #12x12x10
    x = F.relu(self.conv2(x)) #8x8x10
    x = self.pool(x) #4x4x10    
    x = x.view(-1, 4*4*10) #flattening
    x = F.relu(self.fc1(x))
    x = self.fc2(x)
    return x

# CNN for Cifar10
class CifarCnn(nn.Module):
    def __init__(self):
        super(CifarCnn, self).__init__()
        self.conv1 = nn.Conv2d(3, 6, 5)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(6, 16, 5)
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(-1, 16 * 5 * 5)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)
        return F.log_softmax(x, dim=1)

# Logistic Regression for Mnist
class MnistLogisticRegression(torch.nn.Module):
    def __init__(self):
        super(MnistLogisticRegression, self).__init__()
        self.linear = torch.nn.Linear(784, 10)

    def forward(self, x):
        outputs = self.linear(x)
        return outputs

