import torch
import torchvision.transforms as transforms
import torchvision.datasets as datasets
from config import Config


# dataloader for the mnist dataset
class MnistDataLoader(object):
    def __init__(self, argv):
        config = Config(argv)
        self.train_dataset = datasets.MNIST(root='../../data/mnist/mnist_train', train=True, transform=transforms.ToTensor(), download=True)
        self.test_dataset = datasets.MNIST(root='../../data/mnist/mnist_test', train=False, transform=transforms.ToTensor(), download=True)
        self.train_loader = torch.utils.data.DataLoader(dataset=self.train_dataset, batch_size = config.batch_size, shuffle=True)
        self.test_loader = torch.utils.data.DataLoader(dataset=self.test_dataset, batch_size = config.batch_size, shuffle=False)

# dataloader for the ciphar dataset
class CifarDataLoader(object):
    def __init__(self, argv):
        config = Config(argv)
        self.train_dataset = datasets.CIFAR10('../../data/cifar/cifar_train', train=True, download=True, transform=transforms.Compose([transforms.ToTensor(),transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))]))
        self.test_dataset = datasets.CIFAR10('../../data/cifar/cifar_test', download=True, train=False, transform=transforms.Compose([transforms.ToTensor(),transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))]))
        self.train_loader = torch.utils.data.DataLoader(self.train_dataset, batch_size=config.batch_size,shuffle=True)
        self.test_loader = torch.utils.data.DataLoader(self.test_dataset, batch_size=config.batch_size,shuffle=False)
        