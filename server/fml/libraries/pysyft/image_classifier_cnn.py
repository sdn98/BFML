import torch
import sys
# absolute path to utilities
sys.path.insert(0, 'C:\\Users\\ahmed.saidani\\Desktop\\FMLB\\server\\fml\\utils')
import torch.nn as nn
from models import CifarCnn, MnistCnn
from data_loaders import CifarDataLoader, MnistDataLoader
from config import Config
import torchvision.transforms as transforms
import torchvision.datasets as datasets
import torch.optim as optim
import syft as sy  # <-- NEW: import the Pysyft library
import os, psutil
import time
from sklearn.metrics import precision_score, recall_score, f1_score

# declare the config, model, dataset, optimizer, and criterion
config = Config()

# supports both mnist and cifar datasets
if config.dataset =="CIFAR":
    model = CifarCnn()
else:
    model = MnistCnn()

if config.dataset =="CIFAR":
    dataloader = CifarDataLoader()
else:
    dataloader = MnistDataLoader()

optimizer = optim.SGD(model.parameters(), lr=config.lr)
criterion = nn.CrossEntropyLoss()

# declare clients
hook = sy.TorchHook(torch)  
client_one = sy.VirtualWorker(hook, id="client_one")  
client_two = sy.VirtualWorker(hook, id="client_two")  

# workers and gpu config
use_cuda = config.gpu and torch.cuda.is_available()
torch.manual_seed(1)
device = torch.device("cuda" if use_cuda else "cpu")
kwargs = {'num_workers': 1, 'pin_memory': True} if use_cuda else {}

# load federated dataset
federated_train_loader = sy.FederatedDataLoader(dataloader.train_dataset.federate((client_one, client_two)), batch_size=config.batch_size, shuffle=True, **kwargs)

# define training
def train():
    for i in range(config.epochs):
        model.train()
        for batch_idx, (data, target) in enumerate(federated_train_loader): 
            model.send(data.location) 
            data, target = data.to(device), target.to(device)
            optimizer.zero_grad()
            output = model(data)
            loss = criterion(output, target)
            loss.backward()
            optimizer.step()
            model.get() 

# define testing
def test():
    model.eval()
    total_loss = 0
    correct = 0
    total = 0
    y_true = []
    y_pred = []
    with torch.no_grad():
        for data, target in dataloader.test_loader:
            data, target = data.to(device), target.to(device)
            output = model(data)
            y_true.extend(target.numpy())
            _, predicted = torch.max(output.data, 1)
            y_pred.extend(predicted.cpu().numpy())
            total_loss += criterion(output, target).item() 
            pred = output.argmax(1, keepdim=True) 
            correct += pred.eq(target.view_as(pred)).sum().item()
            total += target.size(0)
    # get accuracy metrics        
    accuracy = str(100 * correct/total)
    total_loss = str(total_loss/total)
    precision=str(100 * sum(precision_score(y_true, y_pred, average=None))/len(dataloader.train_dataset.classes))
    recall=str(100 * sum(recall_score(y_true, y_pred, average=None))/len(dataloader.train_dataset.classes))
    fone=str(100 * sum(f1_score(y_true, y_pred, average=None))/len(dataloader.train_dataset.classes))
    return accuracy, total_loss, precision, recall, fone

# define benchmarking function        
def benchmark():
  # declare start time, cpu and network use at the begining 
  start_time = time.time()
  old_network = psutil.net_io_counters().bytes_recv + psutil.net_io_counters().bytes_sent
  old_cpu = psutil.cpu_percent(interval=None)
  # scrape metrics
  train()
  accuracy, total_loss, precision, recall, fone = test()
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
  data = '{ library: pysyft; \n accuracy: ' + accuracy + '; \n loss: ' + total_loss + '; \n recall: ' + recall + '; \n precision: ' + precision + '; \n f1: ' + fone + '; \n time: ' + execution_time + '; \n network: ' + network  + '; \n memory: ' +  memory + '; \n cpu: ' +  cpu + '; \n gpu: ' +  gpu +"; \n }"
  print(data)
  sys.stdout.flush()
 
# run
benchmark()

