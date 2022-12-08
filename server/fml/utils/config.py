# configure the ML model training setting

class Config(object):
    def __init__(self, argv):
        self.model = argv[1]
        self.dataset = argv[2]
        self.batch_size = int(argv[3]) 
        self.epochs = int(argv[4])
        self.lr = float(argv[5])
        self.communication_rounds = int(argv[6])
        self.loss_function = argv[7]
        self.optimizer = argv[8]
        if (argv[9]=="True"):
            self.gpu = True
        else: 
            self.gpu = False
        
