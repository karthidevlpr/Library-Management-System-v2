const HttpStatus = require('http-status');
const Book = require("../models/Book");
const Validation = require("./Validation");
const moment = require('moment');

exports.save = async(req, res) => {            //Book Save

    try {

        let newBook = new Book;
        newBook.createdOn = moment();
        newBook.updatedOn = moment();

        let saveBook = await newBook.save();
        res.status(HttpStatus.OK).json(saveBook);

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};

exports.list = async(req, res)=> {                // Gets the List of Book.
    console.log('Book list invoked...');

    try {
        let books = await Book.find();
        res.status(HttpStatus.OK).json(books);

    } catch (err) {
        Validation.errorHandling(err, res)
    }

};

exports.fetch = async(req, res) => {       // Gets an Book matching the Id.

    console.log("Getting Book with id : " + req.params.id);

    try {
        let book = await Book.findById(req.params.id);

        if (_.isNull(book)) {
            res.status(HttpStatus.NOT_FOUND).json({error: 'Book not found'});
            return;
        }
        res.status(HttpStatus.OK).json(user);

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};

exports.update = async(req, res) => {      // Updates an Book.

    console.log('Updating Book with id : ' + req.params.id);

    try {
        let book = await Book.findById(req.params.id).lean();

        if (_.isNull(book)) {
            res.status(HttpStatus.NOT_FOUND).json({error: 'Book not found'});
            return;
        }
        book.name = req.body.name;
        book.author = req.body.author;
        book.availability = req.body.availability;
        book.updatedOn = moment();

        let updateBook = await book.save();
        res.status(HttpStatus.OK).json(updateBook);

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};

exports.changeActiveStatus = async(req, res) => {      // Updates an Book.

    try {
        let book = await Book.findById(req.params.id).lean();

        if (_.isNull(book)) {
            res.status(HttpStatus.NOT_FOUND).json({error: 'Book not found'});
            return;
        }

        if (req.params.status == "active")
            book.active = true;

        if (req.params.status == "inactive")
            book.active = false;

        let updateBook = await book.save();
        res.status(HttpStatus.OK).json(updateBook);

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};

exports.activeList = async(req, res) => {                // Gets the List of Book.
    console.log('Book list invoked...');

    try {
        let books = await Book.find({active: true, availability: true});
        res.status(HttpStatus.OK).json(books);

    } catch (err) {
        Validation.errorHandling(err, res)
    }
};
