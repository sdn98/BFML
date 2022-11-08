import warnings
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchvision import datasets, transforms
from torchvision.datasets import MNIST
from torchvision.transforms import Compose, ToTensor
from torch.autograd import Variable
import syft as sy  # <-- NEW: import the Pysyft library

hook = sy.TorchHook(torch)  # <-- NEW: hook PyTorch ie add extra functionalities to support Federated Learning
bob = sy.VirtualWorker(hook, id="bob")  # <-- NEW: define remote worker bob
alice = sy.VirtualWorker(hook, id="alice")  # <-- NEW: and alice
epochs = 10
warnings.filterwarnings("ignore", category=UserWarning)
no_cuda = False
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
kwargs = {'num_workers': 1, 'pin_memory': True} if no_cuda else {}
batch_size = 100
test_batch_size = 1000
federated_train_loader = sy.FederatedDataLoader( # <-- this is now a FederatedDataLoader 
    datasets.MNIST('../../data/mnist/mnist_train', train=True, download=True,
                   transform=transforms.Compose([
                       transforms.ToTensor(),
                       transforms.Normalize((0.1307,), (0.3081,))
                   ]))
    .federate((bob, alice)), # <-- NEW: we distribute the dataset across all the workers, it's now a FederatedDataset
    batch_size=batch_size, shuffle=True, **kwargs)

federated_train_loader = federated_train_loader.view(-1, 28 * 28)

test_loader = torch.utils.data.DataLoader(
    datasets.MNIST('../../data/mnist/mnist_test', train=False, download=True, transform=transforms.Compose([
                       transforms.ToTensor(),
                       transforms.Normalize((0.1307,), (0.3081,))
                   ])),
    batch_size= test_batch_size, shuffle=True, **kwargs)
input_dim = 784
output_dim = 28
lr = 0.01
log_interval = 30
save_model = False
seed = 1
criterion = torch.nn.CrossEntropyLoss()

class LogisticRegression(torch.nn.Module):
    def __init__(self, input_dim, output_dim):
        super(LogisticRegression, self).__init__()
        self.linear = torch.nn.Linear(input_dim, output_dim)

    def forward(self, x):
        outputs = self.linear(x)
        return outputs

def train(model, device, federated_train_loader, optimizer, epoch):
    model.train()
    for batch_idx, (data, target) in enumerate(federated_train_loader): # <-- now it is a distributed dataset
        # data = Variable(data.view(-1, 28 * 28))
        # target = Variable(target)
        model.send(data.location) # <-- NEW: send the model to the right location
        data, target = data.to(device), target.to(device)
        optimizer.zero_grad()
        output = model(data)
        loss = F.nll_loss(output, target)
        loss.backward()
        optimizer.step()
        model.get() # <-- NEW: get the model back
        if batch_idx % log_interval == 0:
            loss = loss.get() # <-- NEW: get the loss back
            print('Train Epoch: {} [{}/{} ({:.0f}%)]\tLoss: {:.6f}'.format(
                epoch, batch_idx * batch_size, len(federated_train_loader) * batch_size,
                100. * batch_idx / len(federated_train_loader), loss.item()))

def test(model, device, test_loader):
    model.eval()
    test_loss = 0
    correct = 0
    with torch.no_grad():
        for data, target in test_loader:
            data, target = data.to(device), target.to(device)
            output = model(data)
            test_loss += F.nll_loss(output, target, reduction='sum').item() # sum up batch loss
            pred = output.argmax(1, keepdim=True) # get the index of the max log-probability 
            correct += pred.eq(target.view_as(pred)).sum().item()

    test_loss /= len(test_loader.dataset)

    print('\nTest set: Average loss: {:.4f}, Accuracy: {}/{} ({:.0f}%)\n'.format(
        test_loss, correct, len(test_loader.dataset),
        100. * correct / len(test_loader.dataset)))


model = LogisticRegression(input_dim, output_dim).to(device)
optimizer = torch.optim.SGD(model.parameters(), lr=lr)


for epoch in range(1, epochs + 1):
    train(model, device, federated_train_loader, optimizer, epoch)

if (save_model):
    torch.save(model.state_dict(), "mnist_logreg.pt")


# import torch
# import torch.nn as nn
# import torch.nn.functional as F
# import torch.optim as optim
# from torchvision import datasets, transforms
# from torch.autograd import Variable
# import syft as sy  # <-- NEW: import the Pysyft library

# hook = sy.TorchHook(torch)  # <-- NEW: hook PyTorch ie add extra functionalities to support Federated Learning
# bob = sy.VirtualWorker(hook, id="bob")  # <-- NEW: define remote worker bob
# alice = sy.VirtualWorker(hook, id="alice")  # <-- NEW: and alice
# epochs = 10

# class Arguments():
#     def __init__(self):
#         self.batch_size = 64
#         self.test_batch_size = 1000
#         self.epochs = epochs
#         self.lr = 0.01
#         self.momentum = 0.5
#         self.no_cuda = False
#         self.seed = 1
#         self.log_interval = 30
#         self.save_model = False

# args = Arguments()
# input_dim = 28
# output_dim = 10
# use_cuda = not args.no_cuda and torch.cuda.is_available()

# torch.manual_seed(args.seed)

# device = torch.device("cuda" if use_cuda else "cpu")

# kwargs = {'num_workers': 1, 'pin_memory': True} if use_cuda else {}

# federated_train_loader = sy.FederatedDataLoader( # <-- this is now a FederatedDataLoader 
#     datasets.MNIST('../../data/mnist/mnist_train', train=True, download=True,
#                    transform=transforms.Compose([
#                        transforms.ToTensor(),
#                        transforms.Normalize((0.1307,), (0.3081,))
#                    ]))
#     .federate((bob, alice)), # <-- NEW: we distribute the dataset across all the workers, it's now a FederatedDataset
#     batch_size=args.batch_size, shuffle=True, **kwargs)

# test_loader = torch.utils.data.DataLoader(
#     datasets.MNIST('../../data/mnist/mnist_test', train=False, download=True, transform=transforms.Compose([
#                        transforms.ToTensor(),
#                        transforms.Normalize((0.1307,), (0.3081,))
#                    ])),
#     batch_size=args.test_batch_size, shuffle=True, **kwargs)

# class LogisticRegression(torch.nn.Module):
#     def __init__(self, input_dim, output_dim):
#         super(LogisticRegression, self).__init__()
#         self.linear = torch.nn.Linear(input_dim, output_dim)

#     def forward(self, x):
#         outputs = self.linear(x)
#         return outputs

# def train(args, model, device, federated_train_loader, optimizer, epoch):
#     model.train()
#     for batch_idx, (data, target) in enumerate(federated_train_loader): # <-- now it is a distributed dataset
#         # data = Variable(data.view(-1, 28 * 28))
#         # target = Variable(target)
#         model.send(data.location) # <-- NEW: send the model to the right location
#         data, target = data.to(device), target.to(device)
#         optimizer.zero_grad()
#         output = model(data)
#         loss = F.nll_loss(output, target)
#         loss.backward()
#         optimizer.step()
#         model.get() # <-- NEW: get the model back
#         if batch_idx % args.log_interval == 0:
#             loss = loss.get() # <-- NEW: get the loss back
#             print('Train Epoch: {} [{}/{} ({:.0f}%)]\tLoss: {:.6f}'.format(
#                 epoch, batch_idx * args.batch_size, len(federated_train_loader) * args.batch_size,
#                 100. * batch_idx / len(federated_train_loader), loss.item()))

# def test(args, model, device, test_loader):
#     model.eval()
#     test_loss = 0
#     correct = 0
#     with torch.no_grad():
#         for data, target in test_loader:
#             data, target = data.to(device), target.to(device)
#             output = model(data)
#             test_loss += F.nll_loss(output, target, reduction='sum').item() # sum up batch loss
#             pred = output.argmax(1, keepdim=True) # get the index of the max log-probability 
#             correct += pred.eq(target.view_as(pred)).sum().item()

#     test_loss /= len(test_loader.dataset)

#     print('\nTest set: Average loss: {:.4f}, Accuracy: {}/{} ({:.0f}%)\n'.format(
#         test_loss, correct, len(test_loader.dataset),
#         100. * correct / len(test_loader.dataset)))

# model = LogisticRegression(input_dim, output_dim).to(device)
# optimizer = optim.SGD(model.parameters(), lr=args.lr) # TODO momentum is not supported at the moment

# for epoch in range(1, args.epochs + 1):
#     train(args, model, device, federated_train_loader, optimizer, epoch)
#     test(args, model, device, test_loader)

# if (args.save_model):
#     torch.save(model.state_dict(), "mnist_cnn.pt")

# import torch
# import torch.nn as nn
# import torch.nn.functional as F
# from torch.autograd import Variable
# import numpy as np
# import pandas as pd
# import random
# import syft as sy  # <-- NEW: import the Pysyft library

# no_cuda = False
# use_cuda = not no_cuda and torch.cuda.is_available()
# hook = sy.TorchHook(torch)  # <-- NEW: hook PyTorch ie add extra functionalities to support Federated Learning
# bob = sy.VirtualWorker(hook, id="bob")  # <-- NEW: define remote worker bob
# alice = sy.VirtualWorker(hook, id="alice")  # <-- NEW: and alice
# # Importing the dataset
# device = torch.device("cuda" if use_cuda else "cpu")

# kwargs = {'num_workers': 1, 'pin_memory': True} if use_cuda else {}
# df = pd.read_csv('../../data/Iris.csv').federate((bob, alice))

# # Dropping index
# df = df.drop(['Id'], axis=1)

# # Encoding class labels
# class_mapping = {label:idx for idx,label in enumerate(np.unique(df['Species']))}
# df['Species'] = df['Species'].map(class_mapping)

# # Spliting dataset into train and test
# df = df.values
# np.random.shuffle(df)

# X = df[:,:-1]
# y = df[:,-1]

# train_len = int(0.8 * len(y))
# test_len = int(len(y) - train_len)

# X_train = X[:train_len]
# y_train = y[:train_len]

# X_test = X[-test_len:]
# y_test = y[-test_len:]

# # Defining the network
# class LogisticRegression(torch.nn.Module):
#     def __init__(self, D_in, H, D_out):
#         super(LogisticRegression, self).__init__()
#         self.input_linear = torch.nn.Linear(D_in, H)
#         self.middle_linear = torch.nn.Linear(H, H)
#         self.output_linear = torch.nn.Linear(H, D_out)

#     def forward(self, x):
#         h_relu = F.relu(self.input_linear(x))
#         for _ in range(random.randint(0, 3)):
#             h_relu = self.middle_linear(h_relu).clamp(min=0)
#         y_pred = self.output_linear(h_relu)
#         return y_pred

# D_in, H, D_out = 4, 20, 3
# lr = 0.01
# model = LogisticRegression(4, 20, 3)

# if torch.cuda.is_available():
#     print('CUDA Available')
#     model.cuda()

# criterion = nn.CrossEntropyLoss()
# optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

# # Trainning the model
# num_epochs = 2000
# for epoch in range(num_epochs):
#     model.send(data.location) # <-- NEW: send the model to the right location
#     data, target = data.to(device), target.to(device)
#     # Forward pass: Compute predicted y by passing x to the model
#     if torch.cuda.is_available():
#         x = Variable(torch.Tensor(X_train).cuda())
#         y = Variable(torch.Tensor(y_train).cuda())
#     else:
#         x = Variable(torch.Tensor(X_train).float())
#         y = Variable(torch.Tensor(y_train).long())    

#     y_pred = model(x)

#     # Compute and print loss
#     loss = criterion(y_pred, y)
#     # Zero gradients, perform a backward pass, and update the weights.
#     optimizer.zero_grad()
#     loss.backward()
#     optimizer.step()
#     if (epoch) % 100 == 0:
#         print('Epoch [%d/%d] Loss: %.4f' %(epoch + 1, num_epochs, loss.data))
        
# # Getting the predictions and the accuracy score
# if torch.cuda.is_available():
#     x = Variable(torch.Tensor(X_test).cuda())
#     y = torch.Tensor(y_test).long()
# else:
#     x = Variable(torch.Tensor(X_test).float())
#     y = torch.Tensor(y_test).long()

# out = model(x)
# _, predicted = torch.max(out.data, 1)

# print('Accuracy of the network %d %%' % (100 * torch.sum(y==predicted) / len(y_test)))
