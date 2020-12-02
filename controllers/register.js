const jwt = require("jsonwebtoken");
const { token } = require("morgan");
const redis = require("redis");

const redisClient = redis.createClient(process.env.REDIS_URI);

const handleRegister = (db, bcrypt) => (req, res) => {

    //validtion
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form sumbission');
    }

    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        if(user[0].email){
                        return createSession(user[0])
                        }
                        // res.json(user[0])
                    }).then( (session) => res.json(session))
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('Unable to connecting'))
}

const createSession = (data) => {
    const { email , id} = data;
    const token = signToken(email);
    return setToken(token, id)
    .then(() =>{
        return { success: "true", userId: id, token}
    }).catch((err) => res.status(400).json(err));
}

const signToken = (email) => {
    const jwtPayload = {email};
    return jwt.sign(jwtPayload, "JWT_SECRET", {expiresIn: "1 day"})
}

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));


module.exports = {
    handleRegister: handleRegister
}