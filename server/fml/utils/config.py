# configure the ML model training setting

class Config(object):
    def __init__(self):
        self.model = "CNN"
        self.dataset = "CIFAR"
        self.batch_size = 100
        self.epochs = 1
        self.lr = 0.01
        self.communication_rounds = 3
        self.loss_function = "cross_entropy"
        self.optimizer = "sgd"
        self.gpu = False