const express = require('express');
const app = express();
const port = process.env.PORT || 7070;
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const init = require("./server/init/init");

app.use(cors());

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {path: '/', httpOnly: true, maxAge: 30 * 30000},
    rolling: true
}));

require('./dbConnection')(app);
require("./server/routes.js")(app);
init.saveSuperAdmin();

app.listen(port);
console.log('App is listening on port: ' + port);