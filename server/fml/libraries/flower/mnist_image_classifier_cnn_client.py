import warnings
from collections import OrderedDict
import flwr as fl
import torch
import sys
# absolute path to utilities
sys.path.insert(0, 'C:\\Users\\ahmed.saidani\\Desktop\\FMLB\\server\\fml\\utils')
import torch.nn as nn
from models import MnistCnn
from data_loaders import MnistDataLoader
from config import Config
import torch.optim as optim
from tqdm import tqdm
from sklearn.metrics import precision_score, recall_score, f1_score
from torch.autograd import Variable
import os, psutil
import GPUtil

# declare the config, gpu, model, dataset, optimizer, and criterion
warnings.filterwarnings("ignore", category=UserWarning)
config = Config(sys.argv)
dataloader = MnistDataLoader(sys.argv)
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
model = MnistCnn().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), config.lr, momentum=0.9)

# define training
def train():
    for epoch in range(int(config.epochs)):
        for i, (images, labels) in enumerate(dataloader.train_loader):
            images = images.to(device)
            labels = labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
        
# define testing
def test():
    """Validate the model on the test set."""
    correct, total, loss = 0, 0, 0.0
    y_true = []
    y_pred = []
    with torch.no_grad():
        for images, labels in tqdm(dataloader.test_loader):
            images = images.to(device)
            labels = labels.to(device)
            outputs = model(images.to(device))
            y_true.extend(labels.numpy())
            _, predicted = torch.max(outputs.data, 1)
            y_pred.extend(predicted.cpu().numpy())
            labels = labels.to(device)
            loss += criterion(outputs, labels).item()
            total += labels.size(0)
            correct += (torch.max(outputs.data, 1)[1] == labels).sum().item()
    loss = loss / len(dataloader.test_loader.dataset)
    accuracy = 100 * (correct / total)
    precision = 100 * sum(precision_score(y_true, y_pred, average=None))/len(dataloader.train_dataset.classes)
    recall = 100 * sum(recall_score(y_true, y_pred, average=None))/len(dataloader.train_dataset.classes)
    fone = 100 * sum(f1_score(y_true, y_pred, average=None))/len(dataloader.train_dataset.classes)
    memory = float(psutil.Process(os.getpid()).memory_info().rss / 1024 ** 2)
    return loss, accuracy, precision, recall, fone, memory

# define flower client
class FlowerClient(fl.client.NumPyClient):
    def get_parameters(self, config):
        return [val.cpu().numpy() for _, val in model.state_dict().items()]

    def set_parameters(self, parameters):
        params_dict = zip(model.state_dict().keys(), parameters)
        state_dict = OrderedDict({k: torch.tensor(v) for k, v in params_dict})
        model.load_state_dict(state_dict, strict=True)

    def fit(self, parameters, config):
        self.set_parameters(parameters)
        train()
        return self.get_parameters(config={}), len(dataloader.train_loader.dataset), {}

    def evaluate(self, parameters, config):
        self.set_parameters(parameters)
        loss, accuracy, precision, recall, fone, memory = test()
        return loss, len(dataloader.test_loader.dataset), {"accuracy": accuracy, "loss": loss, "precision": precision,"recall": recall,"fone": fone, "memory": memory}

# start flower client
fl.client.start_numpy_client(
    server_address="localhost:5040",
    client=FlowerClient(),
)