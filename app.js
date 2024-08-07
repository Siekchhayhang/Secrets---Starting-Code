//jshint esversion:6
import 'dotenv/config'
import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import mongoose from 'mongoose';
import encrypt from 'mongoose-encryption';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema( {
    email: String,
    password: String
});

const secret = process.env.SECRET;
// console.log(secret);
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get('/',  (req, res) =>{
    res.render('home');
});
app.get('/login', (req, res) =>{
    res.render('login');
});
app.get('/register', (req, res) =>{
    res.render('register');
});

app.post('/register',(req, res) =>{

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save().then(()=>{
        res.render("secrets");
    }).catch((error)=>{
        console.log(error);
    });
});

app.post('/login', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }).then((foundUser) => {
        if (foundUser) {
            if (foundUser.password === password) {
                res.render("secrets");
            }
        } else {
            res.send("User not found");
        }
    });
});





app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});