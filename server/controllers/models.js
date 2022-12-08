
const Models = require('../models/models');
const { exec } = require('child_process');
require('dotenv').config();

// creates a new model
exports.createModel = async (req, res, next) => {
    const { model, library_name, version, environment, script } = req.body;
    try {
        const Model = await Models.create({
            model,
            library_name,
            version,
            environment,
            script
        });
        return res.status(200).json({
            Model
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
};

// gets all models in the database
exports.getModels = async (req, res, next) => {
    try {
        let models = await Models.find({}).exec();
        return res.status(200).json(models);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
};

// deletes a model from the database
exports.deleteModel = async (req, res, next) => {
    try {
        await Models.findByIdAndRemove(req.params.id).exec();
        return res.status(200).json({ message: `deleted successfully` });
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
};
