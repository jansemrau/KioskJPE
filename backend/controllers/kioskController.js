const AppError = require("../utils/appError");
const Participants = require("../models/participantsModel");

const Products = require("../models/productsModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const graphqlResolver = require("../graphql/resolvers/index");

exports.getAllParticipants = catchAsync(async (req, res, next) => {
    const result = graphqlResolver.getAllParticipants(req.query);
    res.status(200).json({
        status: "success",
        results: result.length,
        data: {
            participants: result,
        },
    });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const result = graphqlResolver.getAllProducts(req.query);
    res.status(200).json({
        status: "success",
        results: result.length,
        data: {
            products: result,
        },
    });
});

exports.newParticipant = catchAsync(async (req, res, next) => {
    const newParticipant = graphqlResolver.createParticipant(req.query);

    res.status(201).json({
        status: "success",
        data: {
            participant: newParticipant,
        },
    });
});

exports.newProduct = catchAsync(async (req, res, next) => {
    const newProduct = graphqlResolver.createProduct(req.query);

    res.status(201).json({
        status: "success",
        data: {
            products: newProduct,
        },
    });
});

exports.deleteParticipant = catchAsync(async (req, res, next) => {
    const deletedParticipant = graphqlResolver.deleteParticipant(req.params);

    if (!deletedParticipant) {
        return next(new AppError("No Participant found with that Id", 404));
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const deletedProduct = graphqlResolver.deleteProduct(req.params);

    if (!deletedProduct) {
        return next(new AppError("No Product found with that Id", 404));
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.updateGuthaben = catchAsync(async (req, res, next) => {
    const args = { id: req.params.id, guthabenNeu: req.body.guthaben };
    const updatedParticipant = graphqlResolver.updateGuthaben(args);

    if (!result) {
        return next(new AppError("No Participant found with that Id", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            updatedParticipant,
        },
    });
});
