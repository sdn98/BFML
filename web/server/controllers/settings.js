
const Settings = require('../models/settings');
const https = require('https');

//for settings

exports.createSetting = async (req, res, next) => {
    const { identifier, library, version, model, fedAlgo, clients_number, dataset, dataset_url, dataset_format, dataset_size, datapoints_number, GPU, mode, epochs, batch_size, learning_rate, loss_function, optimizer } = req.body;
    try {
        const Setting = await Settings.create({
            identifier,
            library,
            version,
            model,
            fedAlgo,
            clients_number,
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
            optimizer
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
        const Trained = await Settings.findById(req.params.id).exec();
        return res.status(200).json({
            Trained
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
}
