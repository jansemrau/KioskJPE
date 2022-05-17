module.exports = {
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    password: { type: String },
    token: { type: String },
    required: ["email", "password"],
};
