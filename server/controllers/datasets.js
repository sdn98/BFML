
const Datasets = require('../models/datasets');
const { exec } = require('child_process');
require('dotenv').config();

// creates a new dataset
exports.createDataset = async (req, res, next) => {
    const { dataset_name, dataset_url, dataset_format, dataset_size, datapoints_number } = req.body;
    try {
        const dataset = await Datasets.create({
            dataset_name,
            dataset_url,
            dataset_format,
            dataset_size,
            datapoints_number
        });
        return res.status(200).json({
            dataset
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
};

// gets all datasets in the database
exports.getDatasets = async (req, res, next) => {
    try {
        let datasets = await Datasets.find({}).exec();
        return res.status(200).json(datasets);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
};

// deletes a dataset from the database
exports.deleteDataset = async (req, res, next) => {
    try {
        await Datasets.findByIdAndRemove(req.params.id).exec();
        return res.status(200).json({ message: `deleted successfully` });
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
};
