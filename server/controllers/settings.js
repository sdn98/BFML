
const Settings = require('../models/settings');
const { exec } = require('child_process');
require('dotenv').config();

// creates a new experimental setting
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

// gets all settings in the database
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

// deletes a setting from the database
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

// gets one specific experimental setting
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

// updates one attribute of the attributes of the experimental setting
exports.updateSetting = async (req, res, next) => {
    const { id, key, value } = req.body;
    try {
        let setting = await Settings.findById(id).exec();
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
        return res.status(200).json(id + " is updated successfully");
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
}

// training function
exports.trainSetting = async (req, res, next) => {
    try {
        const toTrain = await Settings.findById(req.params.id).exec();
        if (toTrain.library == "flower") {
            const cmd_server = "conda run -n " + toTrain.environment + " python " + process.env.PATH_TO_LIBRARIES + toTrain.folder + "\\image_classifier_server.py"
            const cmd_client = "conda run -n " + toTrain.environment + " python " + process.env.PATH_TO_LIBRARIES + toTrain.folder + "\\" + toTrain.script

            var execute_server = exec(cmd_server,
                (error, stdout) => {
                    metrics = sanitize(stdout)
                    res.status(200).json({
                        metrics
                    });
                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                });
            for (var i = 0; i < toTrain.clients_number; i++) {
                var execute_client = exec(cmd_client,
                    (error, stdout) => {
                        if (error !== null) {
                            console.log(`exec error: ${error}`);
                        }
                    });
            }
        } else {

            if (toTrain.library == "fedml") {
                var cmd = "conda run -n " + toTrain.environment + " python " + process.env.PATH_TO_LIBRARIES + toTrain.folder + "\\image_classifier.py --cf " + toTrain.script
            } else {
                var cmd = "conda run -n " + toTrain.environment + " python " + process.env.PATH_TO_LIBRARIES + toTrain.folder + "\\" + toTrain.script
            }
            console.log(cmd)
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

// sanitizing the logs 

function sanitize(stdout) {
    console.log(stdout)
    let metrics = stdout.toString().replace(/(\r\n|\n|\r| |{|})/gm, '').split(";").filter(m => m !== '')
    let gpu = metrics[metrics.length - 1].replace('gpu:', '')
    let cpu = metrics[metrics.length - 2].replace("cpu:", "") + " %"
    let memory = metrics[metrics.length - 3].replace("memory:", "").substring(0, 7) + " MB"
    let network = metrics[metrics.length - 4]
    network = String(parseFloat(network.replace("network:", "")) / 1024).substring(0, 7) + "KB"
    let time = metrics[metrics.length - 5].replace("time:", "").substring(0, 7) + " s";
    let fone = metrics[metrics.length - 6].replace("f1:", "").substring(0, 5) + " %"
    let precision = metrics[metrics.length - 7].replace("precision:", "").substring(0, 5) + " %"
    let recall = metrics[metrics.length - 8].replace("recall:", "").substring(0, 5) + " %"
    let loss = metrics[metrics.length - 9].replace("loss:", "").substring(0, 10)
    let accuracy = metrics[metrics.length - 10].replace("accuracy:", "").substring(0, 5) + " %"
    result = new Object()
    result["time"] = time;
    result["network"] = network;
    result["memory"] = memory;
    result["cpu"] = cpu;
    result["gpu"] = gpu;
    result["loss"] = loss;
    result["accuracy"] = accuracy;
    result["precision"] = precision;
    result["recall"] = recall;
    result["fone"] = fone;
    return result
}
