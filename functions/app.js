var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')({origin: true});
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/signup');
var submitQuestionRouter = require('./routes/submitQuestion');
var submitAnswerRouter = require('./routes/submitAnswer');
var voteRouter = require('./routes/vote');
var adminRouter = require('./routes/admin');
var testRouter = require('./routes/test');

var app = express();
app.use(cors);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup', signupRouter);
app.use('/newQuestion',submitQuestionRouter);
app.use('/newAnswer',submitAnswerRouter);
app.use('/vote',voteRouter);
app.use('/admin',adminRouter);
app.use('/test', testRouter);



// app.post('/signup',(req,res,next)=>{
//     console.log("Frfrfr");
//     console.log(req.body) ;
//     res.send('post ok');
// }) ;

module.exports = app;
