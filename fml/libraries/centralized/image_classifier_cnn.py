import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchvision import datasets, transforms
import numpy as np

DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

def im_convert(tensor):
  image = tensor.to("cpu").clone().detach()
  image = image.numpy().squeeze()
  return image

class Net(nn.Module):
  def __init__(self):
    super(Net,self).__init__()
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

train_dataset = datasets.MNIST('../../data/mnist/mnist_train',train=True,download=True, transform=transforms.Compose([transforms.ToTensor()]))
batch_size = 32
validation_split = .1
shuffle_dataset = True
random_seed= 2

# Creating data indices for training and validation splits:
dataset_size = len(train_dataset)
indices = list(range(dataset_size))
split = int(np.floor(validation_split * dataset_size))
if shuffle_dataset :
    np.random.seed(random_seed)
    np.random.shuffle(indices)
train_indices, val_indices = indices[split:], indices[:split]
# Creating PT data samplers and loaders:
train_sampler = torch.utils.data.SubsetRandomSampler(train_indices)
valid_sampler = torch.utils.data.SubsetRandomSampler(val_indices)
 
train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=batch_size, 
                                           sampler=train_sampler)
validation_loader = torch.utils.data.DataLoader(train_dataset, batch_size=batch_size,
                                                sampler=valid_sampler)

test_loader = torch.utils.data.DataLoader(
    datasets.MNIST('../../data/mnist/mnist_test',train=False,download=True,
      transform=transforms.Compose([transforms.ToTensor()])),batch_size=batch_size,shuffle=True)

model = Net().to(DEVICE)
optimizer = optim.SGD(model.parameters(),lr=0.01)
criterion = nn.CrossEntropyLoss()

train_errors = []
train_acc = []
val_errors = []
val_acc = []
n_train = len(train_loader)*batch_size
n_val = len(validation_loader)*batch_size

for i in range(10):
  total_loss = 0
  total_acc = 0  
  c = 0
  for images,labels in train_loader:
    images = images.to(DEVICE)
    labels = labels.to(DEVICE)
    optimizer.zero_grad()
    output = model(images)
    loss = criterion(output,labels)
    loss.backward()
    optimizer.step()
    
    total_loss+=loss.item()
    total_acc+=torch.sum(torch.max(output,dim=1)[1]==labels).item()*1.0    
    c+=1
    print(c) 
  #validation
  
  total_loss_val = 0
  total_acc_val = 0
  c = 0
  for images,labels in validation_loader:
    images = images.to(DEVICE)
    labels = labels.to(DEVICE)
    output = model(images)
    loss = criterion(output,labels)
    
    total_loss_val +=loss.item()
    total_acc_val +=torch.sum(torch.max(output,dim=1)[1]==labels).item()*1.0
    c+=1
  
  train_errors.append(total_loss/n_train)
  train_acc.append(total_acc/n_train)
  val_errors.append(total_loss_val/n_val)
  val_acc.append(total_acc_val/n_val)
  
print("Trainig complete")

total_acc = 0
for images,labels in test_loader:
  images = images.to(DEVICE)
  labels = labels.to(DEVICE)
  output = model(images)
  total_acc+=torch.sum(torch.max(output,dim=1)[1]==labels).item()*1.0

print("Test accuracy :",total_acc/len(test_loader.dataset))

# source : https://github.com/dandiws/CNN-MNIST-pytorch/blob/master/cnn_mnist.py

