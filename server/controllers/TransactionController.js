const HttpStatus = require('http-status');
const Transaction = require("../models/Transaction");
const Validation = require("./Validation");
const Book = require("../models/Book");
const moment = require('moment');

exports.save = async(req, res) => {            //Transaction Save

    try {

        let newTransaction = new Transaction(req.body);
        newTransaction.status = "BORROW";
        newTransaction.createdOn = moment();
        newTransaction.updatedOn = moment();

        let saveTran = await newTransaction.save();

        let book = await Book.findById(saveTran.book).lean();

        if (!_.isNull(book)) {
            book.availability = false;
            book.updatedOn = moment();
            await  book.save();
            res.status(HttpStatus.OK).json(saveTran);
        }

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};

exports.list = async(req, res) => {                // Gets the List of Transaction.
    console.log('Transaction list invoked...');

    try {
        let trans = await Transaction.find().populate('user book').exec();
        res.status(HttpStatus.OK).json(trans);

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};

exports.changeStatus = async(req, res) => {      // Updates an Tranaction.

    try {
        let tran = await Transaction.findById(req.params.id);

        if (_.isNull(tran)) {
            res.status(HttpStatus.NOT_FOUND).json({error: 'Transaction not found'});
            return;
        }
        tran.status = "RETURN";

        let updateTran = await tran.save();

        let book = await Book.findById(updateTran.book).lean();

        if (!_.isNull(book)) {
            book.availability = true;
            book.updatedOn = moment();
            await  book.save();
            res.status(HttpStatus.OK).json(updateTran);
        }

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};
