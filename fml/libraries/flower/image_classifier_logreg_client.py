import warnings
from collections import OrderedDict

import flwr as fl
import torch
from torchvision.datasets import MNIST
from torchvision.transforms import Compose, ToTensor
from torch.autograd import Variable

# #############################################################################
# 1. Regular PyTorch pipeline: nn.Module, train, test, and DataLoader
# #############################################################################

warnings.filterwarnings("ignore", category=UserWarning)
DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
batch_size = 100
trf = Compose([ToTensor()])
trainset = MNIST(root='../../data/mnist/mnist_train', train=True,  transform=trf, download=False)
testset = MNIST(root='../../data/mnist/mnist_test', train=False,  transform=trf)
train_loader = torch.utils.data.DataLoader(dataset=trainset, batch_size=batch_size, shuffle=True)
test_loader = torch.utils.data.DataLoader(dataset=testset, batch_size=batch_size, shuffle=False)
n_iters = 3000
epochs = n_iters / (len(trainset) / batch_size)
input_dim = 784
output_dim = 10
lr_rate = 0.001

class LogisticRegression(torch.nn.Module):
    def __init__(self, input_dim, output_dim):
        super(LogisticRegression, self).__init__()
        self.linear = torch.nn.Linear(input_dim, output_dim)

    def forward(self, x):
        outputs = self.linear(x)
        return outputs


def train(model, trainloader, epochs):
    """Train the model on the training set."""
    criterion = torch.nn.CrossEntropyLoss()
    optimizer = torch.optim.SGD(model.parameters(), lr=lr_rate)
    iter = 0
    for epoch in range(int(epochs)):
        for i, (images, labels) in enumerate(train_loader):
            images = Variable(images.view(-1, 28 * 28))
            labels = Variable(labels)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            iter+=1
            print(iter)

            if iter%500==0:
                # calculate Accuracy
                correct = 0
                total = 0
                for images, labels in test_loader:
                    images = Variable(images.view(-1, 28*28))
                    outputs = model(images)
                    _, predicted = torch.max(outputs.data, 1)
                    total+= labels.size(0)
                    # for gpu, bring the predicted and labels back to cpu fro python operations to work
                    correct+= (predicted == labels).sum()
                accuracy = 100 * correct/total
                print("Iteration: {}. Loss: {}. Accuracy: {}.".format(iter, loss.item(), accuracy))

# Load model and data (simple LogReg, MNIST)
model = LogisticRegression(input_dim, output_dim).to(DEVICE)
# Define Flower client
class FlowerClient(fl.client.NumPyClient):
    def get_parameters(self, config):
        return [val.cpu().numpy() for _, val in model.state_dict().items()]

    def set_parameters(self, parameters):
        params_dict = zip(model.state_dict().keys(), parameters)
        state_dict = OrderedDict({k: torch.tensor(v) for k, v in params_dict})
        model.load_state_dict(state_dict, strict=True)

    def fit(self, parameters, config):
        self.set_parameters(parameters)
        train(model, train_loader, epochs=1)
        return self.get_parameters(config={}), len(train_loader.dataset), {}

# Start Flower client
fl.client.start_numpy_client(
    server_address="127.0.0.1:8080",
    client=FlowerClient(),
)