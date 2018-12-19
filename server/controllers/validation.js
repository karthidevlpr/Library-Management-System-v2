/**
 * Created by Karthick on 03-02-2018.
 * */

const HttpStatus = require('http-status');
const Validation = require("./validation");


exports.validatingErrors = (err) => {
    let errors = {};
    if (err) {
        for (field in err.errors) {
            switch (err.errors[field].kind) {
                case 'required':
                    errors[field] = [field] + ' is Required';
                    break;
                case 'unique':
                    errors[field] = 'Already Exist';
                    break;
                case 'enum':
                    errors[field] = 'Invalid ' + [field];
                    break;
                case 'Number':
                    errors[field] = [field] + ' must be a Number';
                    break;
                case 'Date':
                    errors[field] = [field] + ' must be a Valid Date';
                    break;
                case 'ObjectId':
                    errors[field] = [field] + ' is NotValid';
            }

        }
    }
    return errors;
};

exports.errorHandling = (err, res) => {

    if (err.name === 'ValidationError')
        res.status(HttpStatus.BAD_REQUEST).json(Validation.validatingErrors(err));

    else if (err.name === 'ReferenceError')
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: 'unexpected error accessing data'});

    else
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: err});
};