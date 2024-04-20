
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();

const app = express();

db.sequelize.sync()
.then(()=>{
    console.log('db연결 성공')
})
.catch(console.error)
passportConfig();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser(process.env.SESSION_SECRET))

app.get('/',(req,res)=>{
    res.send('hello express')
})

app.get('/api/posts',(req,res)=>{
   res.json([
    {id:1 , content:'hello'},
    {id:2 , content:'hello'},
    {id:3 , content:'hello'}
   ])
})


app.use(cors({
    origin:'*' ,//허용할 주소(해커피하기위해 cors (proxy 문제 해결))
    credentials:false,
}));
app.use('/post',postRouter);
app.use('/user',userRouter);


app.listen(3065,()=>{
    console.log("서버 실행 중!!!")
});