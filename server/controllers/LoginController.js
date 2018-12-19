const HttpStatus = require('http-status');
const User = require("../models/User");
const Validation = require("./Validation");
const moment = require('moment');
const crypto = require("crypto");
const key = "supersecretkey";

exports.authenticate = async(req, res) => {       // Authenticate User.


    try {
        let user = await User.findOne({
            email: new RegExp('^' + req.body.email + '$', 'i'),
            password: encrypt(key, req.body.password),
            active: true
        });

        if (_.isNull(user)) {
            res.status(HttpStatus.NOT_FOUND).json({error: 'User Name & Password doesn\'t Match'});
            return;
        }
        req.session.loggedInUser = user;
        res.status(HttpStatus.OK).json(user);

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};

exports.logout = async(req, res) => {       // LogOut User.

    if (req.session.loggedInUser) {
        req.session.loggedInUser = null;
        res.status(HttpStatus.OK).json({success: "logout successfully"});
    }

};

exports.getLoggedInUser = async(req, res) => {        // Get Logged in user details.

    try {
        if (req.session.loggedInUser) {
            let user = await User.findById(req.session.loggedInUser._id, {password: 0});

            if (_.isNull(user)) {
                res.status(HttpStatus.NOT_FOUND).json({error: 'User not found'});
                return;
            }
            res.status(HttpStatus.OK).json(req.session.loggedInUser);

        } else {
            res.status(HttpStatus.UNAUTHORIZED).json({error: 'Session invalid'});
        }

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};

function encrypt(key, data) {
    let cipher = crypto.createCipher('aes-256-cbc', key);
    let crypted = cipher.update(data, 'utf-8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
}
