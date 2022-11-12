
const Settings = require('../models/settings');
const { exec } = require('child_process');
const events = require('events');
const myEmitter = new events.EventEmitter()
//for settings

exports.createSetting = async (req, res, next) => {
    const { identifier, library, version, model, fedAlgo, clients_number, communication_rounds, dataset, dataset_url, dataset_format, dataset_size, datapoints_number, GPU, mode, epochs, batch_size, learning_rate, loss_function, optimizer, environment, folder, script } = req.body;
    try {
        const Setting = await Settings.create({
            identifier,
            library,
            version,
            model,
            fedAlgo,
            clients_number,
            communication_rounds,
            dataset,
            dataset_url,
            dataset_format,
            dataset_size,
            datapoints_number,
            GPU,
            mode,
            epochs,
            batch_size,
            learning_rate,
            loss_function,
            optimizer,
            environment,
            folder,
            script
        });
        return res.status(200).json({
            Setting
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
};

exports.getSettings = async (req, res, next) => {
    try {
        let Setting = await Settings.find({}).exec();
        return res.status(200).json(Setting);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
};

exports.deleteSetting = async (req, res, next) => {
    try {
        await Settings.findByIdAndRemove(req.params.id).exec();
        return res.status(200).json({ message: `deleted successfully` });
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
};

exports.getSetting = async (req, res, next) => {
    try {
        let setting = await Settings.findById(req.params.id).exec();
        return res.status(200).json(setting);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
}

exports.updateSetting = async (req, res, next) => {
    const { id, key, value } = req.body;
    try {
        let setting = await Settings.findById(id);
        let updated = setting;
        if (key === "library") {
            updated = await Settings.updateOne(setting, { library: value });
        } else if (key === "version") {
            updated = await Settings.updateOne(setting, { version: value });
        } else if (key === "model") {
            updated = await Settings.updateOne(setting, { model: value });
        } else if (key === "fedAlgo") {
            updated = await Settings.updateOne(setting, { fedAlgo: value });
        } else if (key === "clients_number") {
            updated = await Settings.updateOne(setting, { clients_number: value });
        } else if (key === "dataset") {
            updated = await Settings.updateOne(setting, { dataset: value });
        } else if (key === "dataset_url") {
            updated = await Settings.updateOne(setting, { dataset_url: value });
        } else if (key === " dataset_format") {
            updated = await Settings.updateOne(setting, { dataset_format: value });
        } else if (key === "dataset_size") {
            updated = await Settings.updateOne(setting, { dataset_size: value });
        } else if (key === "datapoints_number") {
            updated = await Settings.updateOne(setting, { datapoints_number: value });
        } else if (key === "GPU") {
            updated = await Settings.updateOne(setting, { GPU: value });
        } else if (key === "mode") {
            updated = await Settings.updateOne(setting, { mode: value });
        } else if (key === "epochs") {
            updated = await Settings.updateOne(setting, { epochs: value });
        } else if (key === " batch_size") {
            updated = await Settings.updateOne(setting, { batch_size: value });
        } else if (key === "learning_rate") {
            updated = await Settings.updateOne(setting, { learning_rate: value });
        } else if (key === "loss_function") {
            updated = await Settings.updateOne(setting, { loss_function: value });
        } else if (key === "optimizer") {
            updated = await Settings.updateOne(setting, { optimizer: value });
        } else if (key === "environment") {
            updated = await Settings.updateOne(setting, { environment: value });
        } else if (key === "folder") {
            updated = await Settings.updateOne(setting, { folder: value });
        } else if (key === "script") {
            updated = await Settings.updateOne(script, { script: value });
        } else if (key === "communication_rounds") {
            updated = await Settings.updateOne(communication_rounds, { communication_rounds: value });
        }
        return res.status(200).json(updated);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
}

exports.trainSetting = async (req, res, next) => {
    try {
        const toTrain = await Settings.findById(req.params.id).exec();
        if (toTrain.library == "flower") {
            const cmd_server = 'conda run -n ' + toTrain.environment + ' python C:\\Users\\ahmed\\OneDrive\\Bureau\\FMLB\\fml\\libraries\\' + toTrain.folder + '\\' + toTrain.script.substring(0, toTrain.script.length - 3) + '_server.py'
            const cmd_client = 'conda run -n ' + toTrain.environment + ' python C:\\Users\\ahmed\\OneDrive\\Bureau\\FMLB\\fml\\libraries\\' + toTrain.folder + '\\' + toTrain.script.substring(0, toTrain.script.length - 3) + '_client.py'
            let first_client_metrics
            let second_client_metrics
            let clients_metrics = []
            let server_metrics
            var execute_server = exec(cmd_server,
                (error, stdout) => {
                    server_metrics = sanitizeFlowerServer(stdout)
                    console.log(stdout)
                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                })

            var execute_client_one = exec(cmd_client,
                (error, stdout) => {
                    first_client_metrics = sanitizeFlowerClient(stdout)
                    console.log(stdout)

                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                });
            var execute_client_two = exec(cmd_client,
                (error, stdout) => {
                    second_client_metrics = sanitizeFlowerClient(stdout)
                    console.log(stdout)

                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                });

            execute_client_two.on('exit', (exitCode) => {
                if (parseInt(exitCode) !== 0) {
                    myEmitter.emit('not-finished');
                }
                setTimeout(() => { myEmitter.emit('finished'); }, "1000")
            })
            myEmitter.on('finished', () => {
                let metrics = combineFlowerMetrics(server_metrics, first_client_metrics, second_client_metrics)
                res.status(200).json({
                    metrics
                })
            })

        } else {
            const cmd = 'conda run -n ' + toTrain.environment + ' python C:\\Users\\ahmed\\OneDrive\\Bureau\\FMLB\\fml\\libraries\\' + toTrain.folder + '\\' + toTrain.script
            var execute = exec(cmd,
                (error, stdout) => {
                    metrics = sanitize(stdout)
                    res.status(200).json({
                        metrics
                    });
                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                });
        }
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
}
function combineFlowerMetrics(server_metrics, first_client_metrics, second_client_metrics) {

    let memory = server_metrics.memory + first_client_metrics.memory + second_client_metrics.memory
    memory = String(memory).substring(0, 5) + " MB"

    let loss = String((first_client_metrics.loss + second_client_metrics.loss) / 2).substring(0, 6)

    let precision = []
    for (let i = 0; i < first_client_metrics.precision.length; i++) {
        precision.push(parseFloat(String((first_client_metrics.precision[i] + second_client_metrics.precision[i]) / 2).substring(0, 6)))
    }
    let recall = []
    for (let i = 0; i < first_client_metrics.recall.length; i++) {
        recall.push(parseFloat(String((first_client_metrics.recall[i] + second_client_metrics.recall[i]) / 2).substring(0, 6)))
    }
    let fone = []
    for (let i = 0; i < first_client_metrics.fone.length; i++) {
        fone.push(parseFloat(String((first_client_metrics.fone[i] + second_client_metrics.fone[i]) / 2).substring(0, 6)))
    }
    let matrixes = []
    matrixes.push(first_client_metrics.matrix)
    matrixes.push(second_client_metrics.matrix)

    let result = new Object()
    result["time"] = server_metrics.time;
    result["network"] = server_metrics.network;
    result["memory"] = memory;
    result["cpu"] = server_metrics.cpu;
    result["loss"] = loss;
    result["accuracy"] = server_metrics.accuracy;
    result["classes"] = second_client_metrics.classes;
    result["precision"] = precision;
    result["recall"] = recall;
    result["fone"] = fone;
    result["matrix"] = matrixes;
    console.log(result)
    return result
}
function sanitizeFlowerServer(stdout) {
    let metrics = stdout.replace(/(\r\n|\n|\r)/gm, "")
    metrics = metrics.split(";")
    let time = metrics[1]
    time = time.replace("time:", "")
    time = time.substring(0, 5) + " s";
    let network = metrics[2]
    network = network.replace("network:", "")
    network = parseFloat(network)
    network = network / 1024
    network = String(network).substring(0, 5) + " KB"
    let memory = metrics[3]
    memory = memory.replace("memory:", "")
    memory = parseFloat(memory.substring(0, 6))
    let cpu = metrics[4]
    cpu = cpu.replace("cpu:", "")
    cpu = cpu + " %"
    let accuracy = metrics[5]
    accuracy = accuracy.replace("accuracy:", "")
    accuracy = accuracy.substring(0, 5) + " %"
    let result = new Object()
    result["time"] = time;
    result["network"] = network;
    result["memory"] = memory;
    result["cpu"] = cpu;
    result["accuracy"] = accuracy;

    return result
}
function sanitizeFlowerClient(stdout) {
    let metrics = stdout.replace(/(\r\n|\n|\r)/gm, "")
    metrics = metrics.split(";")
    let memory = metrics[1]
    memory = memory.replace("memory:", "")
    memory = parseFloat(memory.substring(0, 6))
    let loss = metrics[2]
    loss = loss.replace("loss:", "")
    loss = parseFloat(loss.substring(0, 6))
    let classes = metrics[3]
    classes = classes.replaceAll(" ", "")
    classes = classes.replaceAll("'", "")
    classes = classes.replace("classes:[", "")
    classes = classes.replace("]", "")
    classes = classes.split(",")
    let precision = metrics[4]
    precision = precision.replace("precision:[", "")
    precision = precision.replace("]", "")
    precision = precision.split(" ")
    precision = precision.filter(e => e != "");
    for (let i = 0; i < precision.length; i++) {
        precision[i] = parseFloat(precision[i].substring(0, 5))
    }
    let recall = metrics[5]
    recall = recall.replace("recall:[", "")
    recall = recall.replace("]", "")
    recall = recall.split(" ")
    recall = recall.filter(e => e != "");
    for (let i = 0; i < recall.length; i++) {
        recall[i] = parseFloat(recall[i].substring(0, 5))
    }
    let fone = metrics[6]
    fone = fone.replace("fone:[", "")
    fone = fone.replace("]", "")
    fone = fone.split(" ")
    fone = fone.filter(e => e != "");
    for (let i = 0; i < recall.length; i++) {
        fone[i] = parseFloat(fone[i].substring(0, 5))
    }
    let matrix = metrics[7]
    matrix = matrix.replace("matrix:[", "")
    matrix = matrix.split("]")
    matrix = matrix.filter(e => e != []);
    for (let i = 0; i < matrix.length; i++) {
        matrix[i] = matrix[i].split(" ")
    }
    for (let i = 0; i < matrix.length; i++) {
        matrix[i] = matrix[i].filter(e => e != "");
        matrix[i] = matrix[i].filter(e => e != "[");
    }
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            matrix[i][j] = parseFloat(matrix[i][j])
        }
    }
    let result = new Object()
    result["memory"] = memory;
    result["loss"] = loss;
    result["classes"] = classes;
    result["precision"] = precision;
    result["recall"] = recall;
    result["fone"] = fone;
    result["matrix"] = matrix;

    return result
}

function sanitize(stdout) {
    let metrics = stdout.replace(/(\r\n|\n|\r)/gm, "")
    metrics = metrics.split(";")
    let time = metrics[1]
    time = time.replace("time:", "")
    time = time.substring(0, 5) + " s";
    let network = metrics[2]
    network = network.replace("network:", "")
    network = parseFloat(network)
    network = network / 1024
    network = String(network).substring(0, 5) + " KB"
    let memory = metrics[3]
    memory = memory.replace("memory:", "")
    memory = memory.substring(0, 6) + " MB"
    let cpu = metrics[4]
    cpu = cpu.replace("cpu:", "")
    cpu = cpu + " %"
    let loss = metrics[5]
    loss = loss.replace("loss:", "")
    loss = loss.substring(0, 6)
    let accuracy = metrics[6]
    accuracy = accuracy.replace("accuracy:", "")
    accuracy = accuracy + " %"
    let classes = metrics[7]
    classes = classes.replaceAll(" ", "")
    classes = classes.replaceAll("'", "")
    classes = classes.replace("classes:[", "")
    classes = classes.replace("]", "")
    classes = classes.split(",")
    let precision = metrics[8]
    precision = precision.replace("precision:[", "")
    precision = precision.replace("]", "")
    precision = precision.split(" ")
    precision = precision.filter(e => e != "");
    for (let i = 0; i < precision.length; i++) {
        precision[i] = precision[i].substring(0, 5)
    }
    let recall = metrics[9]
    recall = recall.replace("recall:[", "")
    recall = recall.replace("]", "")
    recall = recall.split(" ")
    recall = recall.filter(e => e != "");
    for (let i = 0; i < recall.length; i++) {
        recall[i] = recall[i].substring(0, 5)
    }
    let fone = metrics[10]
    fone = fone.replace("fone:[", "")
    fone = fone.replace("]", "")
    fone = fone.split(" ")
    fone = fone.filter(e => e != "");
    for (let i = 0; i < recall.length; i++) {
        fone[i] = fone[i].substring(0, 5)
    }
    let matrix = metrics[11]
    matrix = matrix.replace("matrix:[", "")
    matrix = matrix.split("]")
    matrix = matrix.filter(e => e != []);
    for (let i = 0; i < matrix.length; i++) {
        matrix[i] = matrix[i].split(" ")
    }
    for (let i = 0; i < matrix.length; i++) {
        matrix[i] = matrix[i].filter(e => e != "");
        matrix[i] = matrix[i].filter(e => e != "[");
    }
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            matrix[i][j] = parseFloat(matrix[i][j])
        }
    }

    let result = new Object()
    result["time"] = time;
    result["network"] = network;
    result["memory"] = memory;
    result["cpu"] = cpu;
    result["loss"] = loss;
    result["accuracy"] = accuracy;
    result["classes"] = classes;
    result["precision"] = precision;
    result["recall"] = recall;
    result["fone"] = fone;
    result["matrix"] = matrix;

    return result
}








// if (toTrain.library == "flower") {
 //    const cmd_server = 'conda run -n flower python C:\\Users\\ahmed\\OneDrive\\Bureau\\FMLB\\fml\\libraries\\flower\\image_classifier_cnn_server.py'
 //    const cmd_client = 'conda run -n flower python C:\\Users\\ahmed\\OneDrive\\Bureau\\FMLB\\fml\\libraries\\flower\\image_classifier_cnn_client.py'
// let single_client_metrics
// let clients_metrics = []
// let server_metrics
// var execute_server = exec(cmd_server,
//     (error, stdout) => {
//         server_metrics = sanitizeFlowerServer(stdout)
//         console.log(stdout)
//         if (error !== null) {
//             console.log(`exec error: ${error}`);
//         }
//     })
//for (var i=0; i < toTrain.clients_number; i++){
//     var execute_client = exec(cmd_client,
//         (error, stdout) => {
//             single_client_metrics = sanitizeFlowerClient(stdout)
//             clients_metrics.push(single_client_metrics)
//             console.log(stdout)

//             if (error !== null) {
//                 console.log(`exec error: ${error}`);
//             }
//     });
//}

// execute_client.on('exit', (exitCode) => {
//     if (parseInt(exitCode) !== 0) {
//         myEmitter.emit('not-finished');
//     }
//     setTimeout(() => {myEmitter.emit('finished');}, "1000")
// })
// myEmitter.on('finished', () => {
//     let metrics = combineFlowerMetrics(server_metrics, clients_metrics)
//     res.status(200).json({
//         metrics
//     })
// })
//}


// function combineFlowerMetrics(server_metrics, client_metrics) {

//     let memory = server_metrics.memory
//     for (let i=0; i < client_metrics.length; i++){
//     memory += client_metrics[i].memory
//     }
//     memory = memory / client_metrics.length
//     memory = String(memory).substring(0,5) + " MB"
//     let loss
//     for (let i=0; i < client_metrics.length; i++){
//     loss += client_metrics[i].loss
//     }
//     loss = String(loss).substring(0,5)

//     let precision = client_metrics[0].precision
//     for (let i=1; i < client_metrics.precision.length; i++){
//     for (let j=0; j < client_metrics[i].precision.length; j++){
//          precision[j] += client_metrics[i].precision[j]
//     }
//     }
//     precision =  precision / client_metrics.length
//     
//     let recall = client_metrics[0].recall
//     for (let i=1; i < client_metrics.recall.length; i++){
//     for (let j=0; j < client_metrics[i].recall.length; j++){
//          recall[j] += client_metrics[i].recall[j]
//     }
//     }
//     recall =  recall / client_metrics.length
//     
//     let fone = client_metrics[0].fone
//     for (let i=1; i < client_metrics.fone.length; i++){
//     for (let j=0; j < client_metrics[i].fone.length; j++){
//          fone[j] += client_metrics[i].fone[j]
//     }
//     }
//     fone =  fone / client_metrics.length
//     
//     let matrixes = []
//     for (let i=0; i < client_metrics.length; i++){
//         matrixes.push(client_metric[i].matrix)
//     }

//     let result = new Object()
//     result["time"] = server_metrics.time;
//     result["network"] = server_metrics.network;
//     result["memory"] = memory;
//     result["cpu"] = server_metrics.cpu;
//     result["loss"] = loss;
//     result["accuracy"] = server_metrics.accuracy;
//     result["classes"] = client_metrics[0].classes;
//     result["precision"] = precision;
//     result["recall"] = recall;
//     result["fone"] = fone;
//     result["matrix"] = matrixes;
//     console.log(result)
//     return result
// }



