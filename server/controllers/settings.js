
const Settings = require('../models/settings');
const Datasets = require('../models/datasets');
const Models = require('../models/models');
const { exec } = require('child_process');
require('dotenv').config();

// creates a new experimental setting
exports.createSetting = async (req, res, next) => {
    const { identifier, model, fedAlgo, clients_number, communication_rounds, dataset, GPU, mode, epochs, batch_size, learning_rate, loss_function, optimizer } = req.body;
    try {
        const setting = await Settings.create({
            identifier,
            model,
            fedAlgo,
            clients_number,
            communication_rounds,
            dataset,
            GPU,
            mode,
            epochs,
            batch_size,
            learning_rate,
            loss_function,
            optimizer
        });
        return res.status(200).json({
            setting
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
        let settings = await Settings.find({}).exec();
        let results = []
        for (let i = 0; i < settings.length; i++) {
            let result = new Object();
            result["_id"] = settings[i]._id;
            result["identifier"] = settings[i].identifier;
            result["fedAlgo"] = settings[i].fedAlgo;
            result["setting_model"] = await Models.findById(settings[i].model).exec();
            result["setting_dataset"] = await Datasets.findById(settings[i].dataset).exec();
            result["clients_number"] = settings[i].clients_number;
            result["communication_rounds"] = settings[i].communication_rounds;
            result["GPU"] = settings[i].GPU;
            result["mode"] = settings[i].mode;
            result["epochs"] = settings[i].epochs;
            result["batch_size"] = settings[i].batch_size;
            result["learning_rate"] = settings[i].learning_rate;
            result["loss_function"] = settings[i].loss_function;
            result["optimizer"] = settings[i].optimizer;
            results.push(result);
        }
        return res.status(200).json(results);
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
        let model = await Models.findById(setting.model).exec();
        let dataset = await Datasets.findById(setting.dataset).exec();
        let result = new Object();
        result["_id"] = setting._id;
        result["identifier"] = setting.identifier;
        result["library"] = model.library_name;
        result["script"] = model.script;
        result["version"] = model.version;
        result["environment"] = model.environment;
        result["fedAlgo"] = setting.fedAlgo;
        result["model"] = model.model;
        result["dataset"] = dataset.dataset_name;
        result["dataset_size"] = dataset.dataset_size;
        result["datapoints_number"] = dataset.datapoints_number;
        result["clients_number"] = setting.clients_number;
        result["communication_rounds"] = setting.communication_rounds;
        result["GPU"] = setting.GPU;
        result["mode"] = setting.mode;
        result["epochs"] = setting.epochs;
        result["batch_size"] = setting.batch_size;
        result["learning_rate"] = setting.learning_rate;
        result["loss_function"] = setting.loss_function;
        result["optimizer"] = setting.optimizer;
        return res.status(200).json(result);
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
        if (key === "model") {
            updated = await Settings.updateOne(setting, { model: value });
        } else if (key === "fedAlgo") {
            updated = await Settings.updateOne(setting, { fedAlgo: value });
        } else if (key === "clients_number") {
            updated = await Settings.updateOne(setting, { clients_number: value });
        } else if (key === "dataset") {
            updated = await Settings.updateOne(setting, { dataset: value });
        } else if (key === "GPU") {
            updated = await Settings.updateOne(setting, { GPU: value });
        } else if (key === "mode") {
            updated = await Settings.updateOne(setting, { mode: value });
        } else if (key === "epochs") {
            updated = await Settings.updateOne(setting, { epochs: value });
        } else if (key === "batch_size") {
            updated = await Settings.updateOne(setting, { batch_size: value });
        } else if (key === "learning_rate") {
            updated = await Settings.updateOne(setting, { learning_rate: value });
        } else if (key === "loss_function") {
            updated = await Settings.updateOne(setting, { loss_function: value });
        } else if (key === "optimizer") {
            updated = await Settings.updateOne(setting, { optimizer: value });
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
        const toTrainSetting = await Settings.findById(req.params.id).exec();
        const toTrainModel = await Models.findById(toTrainSetting.model).exec();
        const toTrainDataset = await Datasets.findById(toTrainSetting.dataset).exec();

        if (toTrainModel.library_name == "flower") {
            const cmd_server = "conda run -n " + toTrainModel.environment + " python " + process.env.PATH_TO_LIBRARIES + toTrainModel.library_name + "\\image_classifier_server.py " + toTrainModel.model + " " + toTrainDataset.dataset_name + " " + toTrainSetting.batch_size + " " + toTrainSetting.epochs + " " + toTrainSetting.learning_rate + " " + toTrainSetting.communication_rounds + " " + toTrainSetting.loss_function + " " + toTrainSetting.optimizer + " " + toTrainSetting.GPU
            const cmd_client = "conda run -n " + toTrainModel.environment + " python " + process.env.PATH_TO_LIBRARIES + toTrainModel.library_name + "\\" + toTrainModel.script + " " + toTrainModel.model + " " + toTrainDataset.dataset_name + " " + toTrainSetting.batch_size + " " + toTrainSetting.epochs + " " + toTrainSetting.learning_rate + " " + toTrainSetting.communication_rounds + " " + toTrainSetting.loss_function + " " + toTrainSetting.optimizer + " " + toTrainSetting.GPU
            var execute_server = exec(cmd_server,
                (error, stdout) => {
                    let metrics = sanitize(stdout)
                    res.status(200).json({
                        metrics
                    });
                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                });
            for (var i = 0; i < toTrainSetting.clients_number; i++) {
                var execute_client = exec(cmd_client,
                    (error, stdout) => {
                        if (error !== null) {
                            console.log(`exec error: ${error}`);
                        }
                    });
            }
        } else {
            if (toTrainModel.library_name == "fedml") {
                var cmd = "conda run -n " + toTrainModel.environment + " python " + process.env.PATH_TO_LIBRARIES + toTrainModel.library_name + "\\image_classifier.py --cf " + process.env.PATH_TO_LIBRARIES + toTrainModel.library_name + "\\" + toTrainModel.script
            } else {
                var cmd = "conda run -n " + toTrainModel.environment + " python " + process.env.PATH_TO_LIBRARIES + toTrainModel.library_name + "\\" + toTrainModel.script + " " + toTrainModel.model + " " + toTrainDataset.dataset_name + " " + toTrainSetting.batch_size + " " + toTrainSetting.epochs + " " + toTrainSetting.learning_rate + " " + toTrainSetting.communication_rounds + " " + toTrainSetting.loss_function + " " + toTrainSetting.optimizer + " " + toTrainSetting.GPU
            }
            var execute = exec(cmd,
                (error, stdout) => {
                    let metrics = sanitize(stdout)
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
    let metrics = stdout.toString().replace(/(\r\n|\n|\r| |{|})/gm, '').split(";").filter(m => m !== '')
    let gpu = metrics[metrics.length - 1].replace('gpu:', '') + " %"
    let cpu = metrics[metrics.length - 2].replace("cpu:", "") + " %"
    let memory = metrics[metrics.length - 3].replace("memory:", "").substring(0, 7) + " MB"
    let network = metrics[metrics.length - 4]
    network = String(parseFloat(network.replace("network:", "")) / 1024).substring(0, 7) + " KB"
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
