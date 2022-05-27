const catchAsync = require("./utils/catchAsync");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongo = require("mongodb");
const loadDB = require("../../mongodb");

const mailService = require("./utils/mailService");
const userValidation = require("../validation/user");

const config = process.env;

exports.verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return res.status(200).json({
        status: "success",
    });
};

exports.register = catchAsync(async (req, res, next) => {
    // Our register logic starts here
    try {
        // Get user input
        const { firstName, lastName, email, password } = req.body;

        // Validate user input
        if (!(email && password && firstName && lastName)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const db = await loadDB();
        let oldUser = await db.collection("users").findOne({ email: email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        let encryptedUserPassword = await bcrypt.hash(password, 10);

        // Create user in our database

        let user = await db.collection("users").insertOne({
            first_name: firstName,
            last_name: lastName,
            email: email.toLowerCase(), // sanitize
            password: encryptedUserPassword,
        });
        console.log(user);

        // Create token
        const token = jwt.sign(
            { user_id: user.insertedId, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "30m",
            }
        );
        // save user token
        user.token = token;

        // return new user
        return res.status(201).json({
            status: "success",
            data: {
                user: user,
            },
        });
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

exports.login = catchAsync(async (req, res, next) => {
    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const db = await loadDB();
        const user = await db.collection("users").findOne({ email: email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "30m",
                }
            );

            // save user token
            user.token = token;

            // user
            return res.status(200).json({
                status: "success",
                data: {
                    user: user,
                },
            });
        }
        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
    // Our login logic ends here
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    res.send(
        '<form action="http://localhost:8000/auth/passwordreset" method="POST" onsubmit="return false;">' +
            '<input type="email" name="email" value="" placeholder="Enter your email address..." />' +
            '<input type="submit" value="Reset Password" />' +
            "</form>"
    );
});

exports.passwordReset = catchAsync(async (req, res, next) => {
    if (req.body.email !== undefined) {
        var email = req.body.email;

        const db = await loadDB();
        const user = await db.collection("users").findOne({ email: email });

        console.log(user);
        var payload = {
            id: user._id,
            email: email,
        };

        // current password hash from the database, and combine it
        // with the user's created date to make a very unique secret key!
        // For example:
        // var secret = user.password + ‘-' + user.created.getTime();
        var secret = user.password + "-" + new Date().getTime();

        var token = jwt.sign(payload, secret);

        // Send email containing link to reset password.
        mailService.sendMail(
            user.email,
            `Bitte klicke auf den Link, um dein Passwort zurückzusetzen.
            http://localhost:8000/auth/resetpassword/${payload.id}/${token}`
        );
        res.send(
            "As long this mail is available in the system, a mail with a link to reset your password is sent to you"
        );
    } else {
        res.send("Email address is missing.");
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // req.params.id
    const db = await loadDB();
    const user = await db
        .collection("users")
        .findOne({ _id: mongo.ObjectId(req.params.id) });

    var secret = user.password + "-" + new Date().getTime();
    var payload = jwt.decode(req.params.token, secret);

    // TODO: Gracefully handle decoding issues.
    // Create form to reset password.
    res.send(
        '<form action="http://localhost:8000/auth/resetpassword" method="POST" onsubmit="return false">' +
            '<input type="hidden" name="id" value="' +
            payload.id +
            '" />' +
            '<input type="hidden" name="token" value="' +
            req.params.token +
            '" />' +
            '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
            '<input type="submit" value="Reset Password" />' +
            "</form>"
    );
});

exports.newPassword = catchAsync(async (req, res, next) => {
    // req.body.id
    const db = await loadDB();
    const user = await db
        .collection("users")
        .findOne({ _id: mongo.ObjectId(req.body.id) });
    var secret = user.password + "-" + new Date().getTime();

    var payload = jwt.decode(req.body.token, secret);
    let encryptedUserPassword = await bcrypt.hash(req.body.password, 10);
    await db
        .collection("users")
        .updateOne(
            { _id: mongo.ObjectId(req.body.id) },
            { $set: { password: encryptedUserPassword } }
        );
    res.send("Your password has been successfully changed.");
});
