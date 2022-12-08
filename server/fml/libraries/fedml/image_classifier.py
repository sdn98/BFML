import fedml
from fedml import FedMLRunner
import sys
import os, psutil
import time
from sklearn.metrics import precision_score, recall_score, f1_score
import GPUtil

if __name__ == "__main__":
      
    # declare start time, cpu and network use at the begining 
    start_time = time.time()
    old_network = psutil.net_io_counters().bytes_recv + psutil.net_io_counters().bytes_sent
    old_cpu = psutil.cpu_percent(interval=None)

    # init FedML framework
    args = fedml.init()

    # init device
    device = fedml.device.get_device(args)

    # load data
    dataset, output_dim = fedml.data.load(args)

    # load model
    model = fedml.model.create(args, output_dim)

    # start training
    fedml_runner = FedMLRunner(args, device, dataset, model)
    fedml_runner.run()

    # scrape and print performance and efficiency metrics
    execution_time = time.time() - start_time
    cpu = str(psutil.cpu_percent(interval=None))
    execution_time = str(execution_time)
    new_network = psutil.net_io_counters().bytes_recv + psutil.net_io_counters().bytes_sent
    network = str(new_network - old_network)
    memory = str(psutil.Process(os.getpid()).memory_info().rss / 1024 ** 2)
    GPUs = GPUtil.getGPUs()
    gpu = str(GPUs[0].load * 100)

    data = '{ time: ' + execution_time + '; \n network: ' + network + '; \n memory: ' + memory + '; \n cpu: ' + cpu + '; \n gpu: ' + gpu + '; \n }'
    print(data)
    sys.stdout.flush()