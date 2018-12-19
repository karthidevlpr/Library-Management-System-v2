const User = require("../models/User");
const moment = require('moment');
const crypto = require("crypto");
const _ = require('lodash');
var key = "supersecretkey";


exports.saveSuperAdmin = async(req, res) => {               //Save Super Admin

    try {

        let user = await User.findOne({email: new RegExp('^' + "admin@library.com" + '$', 'i')});

        if (!_.isNull(user)) {
            console.log("Super Admin is already created..");
            return;
        }

        let newUser = new User;
        newUser.userName = 'Super';
        newUser.name = "Admin";
        newUser.email = "admin@library.com";
        newUser.mobileNumber = 1234567891;
        newUser.role = "SUPERADMIN";
        newUser.createdOn = moment();
        newUser.updatedOn = moment();
        newUser.password = encrypt(key, "welcome123");

        await newUser.save();
        console.log("Super Admin is created..")

    } catch (err) {
        console.log(err)
    }
};

function encrypt(key, data) {
    let cipher = crypto.createCipher('aes-256-cbc', key);
    let crypted = cipher.update(data, 'utf-8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
}
