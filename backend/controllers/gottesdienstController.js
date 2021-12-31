const AppError = require("../utils/appError");
const Gottesdienst = require("./../models/gottesdienstModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const mongoose = require("mongoose");

exports.getAllGottesdienste = catchAsync(async (req, res, next) => {
    // EXECUTE QUERY
    const features = new APIFeatures(
        Gottesdienst.find().sort({ datetime: "desc" }),
        req.query
    )
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const Gottesdienste = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: Gottesdienste.length,
        data: {
            Gottesdienste: Gottesdienste,
        },
    });
});

exports.getGottesdienst = catchAsync(async (req, res, next) => {
    const Gottesdienst = await Gottesdienst.findById(req.params.id);
    // Gottesdienst.findOne({ _id: req.params.id })

    if (!Gottesdienst) {
        return next(new AppError("No Gottesdienst found with that Id", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            Gottesdienst,
        },
    });
});

exports.createGottesdienst = catchAsync(async (req, res, next) => {
    const newGottesdienst = await Gottesdienst.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            Gottesdienst: newGottesdienst,
        },
    });
});

exports.updateGottesdienst = catchAsync(async (req, res, next) => {
    const Gottesdienst = await Gottesdienst.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );
    if (!Gottesdienst) {
        return next(new AppError("No Gottesdienst found with that Id", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            Gottesdienst,
        },
    });
});

exports.deleteGottesdienst = catchAsync(async (req, res, next) => {
    const deleteGottesdienst = await Gottesdienst.findByIdAndDelete(
        req.params.id
    );

    if (!deleteGottesdienst) {
        return next(new AppError("No Gottesdienst found with that Id", 404));
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});
