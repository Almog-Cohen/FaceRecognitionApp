const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');
const app = express();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');



const db = knex({
    client: 'pg',
    connectionString : {
        host: process.env.DATABASE_URL,
        ssl: true
    }
});


app.use(express.json());



app.use(cors());

app.get('/', (req, res) => {
    res.send("Website working");
})

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })



app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })



app.get('/profile/:id', (res, req) => { profile.handleProfileGet(req, res, db) })




app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 3001, () => {
    console.log('app is runing');
})

