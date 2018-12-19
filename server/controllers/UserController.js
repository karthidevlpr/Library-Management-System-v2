const HttpStatus = require('http-status');
const User = require("../models/User");
const Validation = require("./Validation");
const moment = require('moment');
const crypto = require("crypto");
const key = "supersecretkey";
const nodemailer = require('nodemailer');


exports.save = async(req, res) => {               //User save

    try {

        let user = await User.findOne({email: new RegExp('^' + req.body.email + '$', 'i')});

        if (!_.isNull(user)) {
            res.status(HttpStatus.BAD_REQUEST).json({email: 'Email already exists'});
            return;
        }

        let newUser = new User(req.body);
        newUser.createdOn = moment();
        newUser.updatedOn = moment();

        if (newUser.role == 'ADMIN') {
            let password = generatePassword();
            newUser.password = encrypt(key, password)
        }

        let saveUser = await newUser.save();
        res.status(HttpStatus.OK).json(saveUser);

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};

exports.list = async(req, res)=> {                // Gets the List of Users.
    console.log('User list invoked...');

    try {
        let users = await User.find({role: req.params.id}, {password: 0});
        res.status(HttpStatus.OK).json(users);

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};

exports.fetch = async(req, res) => {       // Gets an User matching the Id.

    console.log("Getting User with id : " + req.params.id);

    try {
        let user = await User.findById(req.params.id, {password: 0});

        if (_.isNull(user)) {
            res.status(HttpStatus.NOT_FOUND).json({error: 'User not found'});
            return;
        }
        res.status(HttpStatus.OK).json(user);

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};

exports.update = async(req, res) => {      // Updates an User.

    console.log('Updating user with id : ' + req.params.id);

    try {
        let user = await User.findById(req.params.id).lean();

        if (_.isNull(user)) {
            res.status(HttpStatus.NOT_FOUND).json({error: 'User not found'});
            return;
        }
        user.userName = req.body.userName;
        user.name = req.body.name;
        user.email = req.body.email;
        user.mobileNumber = req.body.mobileNumber;
        user.role = req.body.role;
        user.updatedOn = moment();

        let updateUser = await user.save();
        res.status(HttpStatus.OK).json(updateUser);

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};

exports.changeActiveStatus = async(req, res) => {      // Updates an User.


    try {
        let user = await User.findById(req.params.id).lean();

        if (_.isNull(user)) {
            res.status(HttpStatus.NOT_FOUND).json({error: 'User not found'});
            return;
        }

        if (req.params.status == "active")
            user.active = true;

        if (req.params.status == "inactive")
            user.active = false;

        let updateUser = await user.save();
        res.status(HttpStatus.OK).json(updateUser);

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};

exports.activeList = async(req, res)=> {                // Gets the List of Users.
    console.log('User list invoked...');

    try {
        let users = await User.find({role: req.params.id, active: true}, {password: 0});
        res.status(HttpStatus.OK).json(users);

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};

function generatePassword() {
    let length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function encrypt(key, data) {
    let cipher = crypto.createCipher('aes-256-cbc', key);
    let crypted = cipher.update(data, 'utf-8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
}

function mailNotification(user, password) {

    let body = '<h5>Dear /userName/</h5></br><p>Your password is : /password/</p>';
    body = body.replace('/userName/', user.name);
    body = body.replace('/password/', password);
    let transporter = nodemailer.createTransport('smtps://test%40gmail.com:test@smtp.gmail.com');

    let mailOptions = {
        from: 'test@gmail.com',
        to: user.email,
        subject: 'Your Password',
        html: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    })


}
