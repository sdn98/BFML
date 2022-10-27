import warnings
from collections import OrderedDict

import flwr as fl
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader
from torchvision.datasets import MNIST
from torchvision.transforms import Compose, Normalize, ToTensor
from tqdm import tqdm


# #############################################################################
# 1. Regular PyTorch pipeline: nn.Module, train, test, and DataLoader
# #############################################################################

warnings.filterwarnings("ignore", category=UserWarning)
DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")


class Net(nn.Module):
    
    def __init__(self) -> None:
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 32, 5)  # chnl-in, out, krnl
        self.conv2 = nn.Conv2d(32, 64, 5)
        self.fc1 = nn.Linear(1024, 512)   # [64*4*4, x]
        self.fc2 = nn.Linear(512, 256)
        self.fc3 = nn.Linear(256, 10)     # 10 classes
        self.pool1 = nn.MaxPool2d(2, stride=2)
        self.pool2 = nn.MaxPool2d(2, stride=2)
        self.drop1 = nn.Dropout(0.25)
        self.drop2 = nn.Dropout(0.50)
  
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # convolution phase         # x is [bs, 1, 28, 28]
        z = F.relu(self.conv1(x))   # Size([bs, 32, 24, 24])
        z = self.pool1(z)           # Size([bs, 32, 12, 12])
        z = self.drop1(z)
        z = F.relu(self.conv2(z))   # Size([bs, 64, 8, 8])
        z = self.pool2(z)           # Size([bs, 64, 4, 4])
   
       # neural network phase
        z = z.reshape(-1, 1024)     # Size([bs, 1024])
        z = F.relu(self.fc1(z))     # Size([bs, 512])
        z = self.drop2(z)
        z = F.relu(self.fc2(z))     # Size([bs, 256])
        z = self.fc3(z)             # Size([bs, 10])
        return z



def train(net, trainloader, epochs):
    """Train the model on the training set."""
    criterion = torch.nn.CrossEntropyLoss()
    optimizer = torch.optim.SGD(net.parameters(), lr=0.001, momentum=0.9)
    for _ in range(epochs):
        for images, labels in tqdm(trainloader):
            optimizer.zero_grad()
            criterion(net(images.to(DEVICE)), labels.to(DEVICE)).backward()
            optimizer.step()


def test(net, testloader):
    """Validate the model on the test set."""
    criterion = torch.nn.CrossEntropyLoss()
    correct, total, loss = 0, 0, 0.0
    with torch.no_grad():
        for images, labels in tqdm(testloader):
            outputs = net(images.to(DEVICE))
            labels = labels.to(DEVICE)
            loss += criterion(outputs, labels).item()
            total += labels.size(0)
            correct += (torch.max(outputs.data, 1)[1] == labels).sum().item()
    return loss / len(testloader.dataset), correct / total


def load_data():
    """Load MNIST (training and test set)."""
    trf = Compose([ToTensor(), Normalize((0.5,), (0.5,))])
    trainset = MNIST("../../data/mnist/mnist_train", train=True, download=True, transform=trf)
    testset = MNIST("../../data/mnist/mnist_test", train=False, download=True, transform=trf)
    return DataLoader(trainset, batch_size=32, shuffle=True), DataLoader(testset)

# Load model and data (simple CNN, MNIST)
net = Net().to(DEVICE)
trainloader, testloader = load_data()

# Define Flower client
class FlowerClient(fl.client.NumPyClient):
    def get_parameters(self, config):
        return [val.cpu().numpy() for _, val in net.state_dict().items()]

    def set_parameters(self, parameters):
        params_dict = zip(net.state_dict().keys(), parameters)
        state_dict = OrderedDict({k: torch.tensor(v) for k, v in params_dict})
        net.load_state_dict(state_dict, strict=True)

    def fit(self, parameters, config):
        self.set_parameters(parameters)
        train(net, trainloader, epochs=1)
        return self.get_parameters(config={}), len(trainloader.dataset), {}

    def evaluate(self, parameters, config):
        self.set_parameters(parameters)
        loss, accuracy = test(net, testloader)
        print("accuracy: " + str(accuracy))
        return loss, len(testloader.dataset), {"accuracy": accuracy}


# Start Flower client
fl.client.start_numpy_client(
    server_address="127.0.0.1:8080",
    client=FlowerClient(),
)