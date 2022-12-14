import torch
from typing import List, Tuple
import sys
import flwr as fl
from flwr.common import Metrics
import os, psutil
import time
sys.path.insert(0, 'C:\\Users\\ahmed.saidani\\Desktop\\FMLB\\server\\fml\\utils')
from config import Config
import GPUtil

# declare the config, start time, and get metrics for the cpu and network before the training starts
start_time = time.time()
old_network = psutil.net_io_counters().bytes_recv + psutil.net_io_counters().bytes_sent
old_cpu = psutil.cpu_percent(interval=None)
config = Config(sys.argv)

# Define metric aggregation function
def weighted_average(metrics: List[Tuple[int, Metrics]]) -> Metrics:
    # Multiply accuracy of each client by number of examples used
    accuracies = [num_examples * m["accuracy"] for num_examples, m in metrics]
    losses = [num_examples * m["loss"] for num_examples, m in metrics]
    precisions = [num_examples * m["precision"] for num_examples, m in metrics]
    recalls = [num_examples * m["recall"] for num_examples, m in metrics]
    fones = [num_examples * m["fone"] for num_examples, m in metrics]
    memories = [num_examples * m["memory"] for num_examples, m in metrics]
    examples = [num_examples for num_examples, _ in metrics]

    #Aggregate and return custom metric (weighted average)
    accuracy = sum(accuracies) / sum(examples)
    loss = sum(losses) / sum(examples)
    precision = sum(precisions) / sum(examples)
    recall = sum(recalls) / sum(examples)
    fone = sum(fones) / sum(examples)
    client_memories = sum(memories) / 10000
    # scrape metrics
    execution_time = time.time() - start_time
    cpu = str(psutil.cpu_percent(interval=None))
    execution_time = str(execution_time)
    new_network = psutil.net_io_counters().bytes_recv + psutil.net_io_counters().bytes_sent
    network = str(new_network - old_network)
    memory = str((psutil.Process(os.getpid()).memory_info().rss / 1024 ** 2) + client_memories)
    if config.gpu == True:
        GPUs = GPUtil.getGPUs()
        gpu = str(GPUs[0].load * 100)
    else:
        gpu = "0"
    # log metrics
    data = '{ library: flower; \n accuracy: ' + str(accuracy) + '; \n loss: ' + str(loss) + '; \n recall: ' + str(recall) + '; \n precision: ' + str(precision) + '; \n f1: ' + str(fone) + '; \n time: ' + execution_time + '; \n network: ' + network  + '; \n memory: ' +  memory + '; \n cpu: ' +  cpu + '; \n gpu: ' +  gpu +"; \n }"
    print(data)
    sys.stdout.flush()
    os._exit(0)
    return {"accuracy": sum(accuracies) / sum(examples)}


# Define strategy
strategy = fl.server.strategy.FedAvg(min_evaluate_clients = 2,
    min_available_clients = 2,
    min_fit_clients = 2,
    evaluate_metrics_aggregation_fn=weighted_average)

# Start Flower server
fl.server.start_server(
    server_address="localhost:5040",
    config=fl.server.ServerConfig(num_rounds=config.communication_rounds),
    strategy=strategy,
)

