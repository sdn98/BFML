from typing import List, Tuple

import flwr as fl
from flwr.common import Metrics
import time
import os, psutil
import sys
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix

# declare start time and network use at the begining 
start_time = time.time()
old_network = psutil.net_io_counters().bytes_recv + psutil.net_io_counters().bytes_sent
old_cpu = psutil.cpu_percent(interval=None)

# Define metric aggregation function
def weighted_average(metrics: List[Tuple[int, Metrics]]) -> Metrics:
    # Multiply accuracy of each client by number of examples used
    accuracies = [num_examples * m["accuracy"] for num_examples, m in metrics]
    examples = [num_examples for num_examples, _ in metrics]
    accuracy = sum(accuracies) / sum(examples)
    # Aggregate and return custom metric (weighted average)
    # scrape metrics
    end_time = time.time()
    execution_time = end_time - start_time
    cpu = str(psutil.cpu_percent(interval=None))
    execution_time = str(execution_time)
    new_network = psutil.net_io_counters().bytes_recv + psutil.net_io_counters().bytes_sent
    network = new_network - old_network
    network = str(network)
    memory = str(psutil.Process(os.getpid()).memory_info().rss / 1024 ** 2)
    accuracy =str(accuracy *100)
    data = ';time:' + execution_time + ';network:' + network + ';memory:' + memory + ';cpu:' + cpu + ';accuracy:' + accuracy + ';'
    print(data)
    sys.stdout.flush()
    return os._exit(0)



# Define strategy
strategy = fl.server.strategy.FedAvg(evaluate_metrics_aggregation_fn=weighted_average)

# Start Flower server
fl.server.start_server(
    server_address="127.0.0.1:8080",
    config=fl.server.ServerConfig(num_rounds=3),
    strategy=strategy,
)