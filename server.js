const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');
const morgan = require('morgan');
const app = express();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');
const signout = require('./controllers/signout');
const removeUser = require('./controllers/removeUser');
const ranklist = require('./controllers/ranklist');





const db = knex({
    client: 'pg',
    connection : {
       connectionString : process.env.DATABASE_URL,
       ssl: true,
    }
});


app.use(express.json());

// Access from any domain
app.use(cors());
app.use(morgan('combined'))


app.get('/', (req, res) => res.send("Website working"))
app.post('/signin', signin.signInAuthentication(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) })
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) })
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', auth.requireAuth,(req, res) => { image.handleApiCall(req, res) })
app.get('/rank-list', auth.requireAuth,(req, res) => { ranklist.handleRankList(req, res, db) })
app.delete('/signout', auth.requireAuth, (req,res) => { signout.removeToken(req, res) })
app.delete('/removeUser/:id', auth.requireAuth, (req,res) => { removeUser.removeUserData(req, res, db) })


app.listen(process.env.PORT || 3001, () => {
    console.log(`app is runing on port ${process.env.PORT}`);
})


