const AppError = require("../utils/appError");
const Participants = require("../models/participantsModel");

const Products = require("../models/productsModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");

exports.getAllParticipants = catchAsync(async (req, res, next) => {
    // EXECUTE QUERY
    const features = new APIFeatures(
        Participants.find().sort({ firstname: "asc" }),
        req.query
    )
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const result = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: result.length,
        data: {
            participants: result,
        },
    });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
    // EXECUTE QUERY
    const features = new APIFeatures(
        Products.find().sort({ name: "asc" }),
        req.query
    )
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const result = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: result.length,
        data: {
            products: result,
        },
    });
});

exports.newParticipant = catchAsync(async (req, res, next) => {
    const newParticipant = await Participants.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            participant: newParticipant,
        },
    });
});

exports.deleteParticipant = catchAsync(async (req, res, next) => {
    const deleteParticipant = await Participants.findByIdAndDelete(
        req.params.id
    );

    if (!deleteParticipant) {
        return next(new AppError("No Participant found with that Id", 404));
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.newProduct = catchAsync(async (req, res, next) => {
    const newProduct = await Products.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            products: newProduct,
        },
    });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const deleteProduct = await Products.findByIdAndDelete(req.params.id);

    if (!deleteProduct) {
        return next(new AppError("No Product found with that Id", 404));
    }

    res.status(204).json({
        status: "success",
        data: null,
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

exports.updateGuthaben = catchAsync(async (req, res, next) => {
    const result = await Participants.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );
    if (!result) {
        return next(new AppError("No Participant found with that Id", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            result,
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
