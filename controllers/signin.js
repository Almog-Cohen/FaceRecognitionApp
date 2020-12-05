const jwt = require("jsonwebtoken");
const { token } = require("morgan");
const redis = require("redis");

//setup reddis
const redisClient = redis.createClient(process.env.REDIS_URL);

const handleSignin = (db, bcrypt, req) => {
  const { email, password } = req.body;

  //vlaidtion
  if (!email || !password) {
    return Promise.reject("incorrect form sumbission");
  }

  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            return user[0];
          })
          .catch((err) => Promise.reject("Unable geet the user"));  
      } else {
        Promise.reject("Worng credentias");
      }
    })
    .catch((err) => Promise.reject("Worng credentias"));
};

// Check if user has existing token
const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, replay) => {
    if (err || !replay) {
      return res.status(400).json("Unautthorized");
    }
    return res.json({ id: replay });
  });
};

// Generate new token
const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, "JWT_SECRET", { expiresIn: "1 day" });
};

// Set token in redis
const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));


// Create new session token with email and id of the user
const createSessions = (data) => {
  console.log(data);
  const { email, id } = data;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: "true", userId: id, token };
    })
    .catch(console.log);
};


const signInAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res)
    : handleSignin(db, bcrypt, req, res)
        .then((data) =>
          data.id && data.email ? createSessions(data) : Promise.reject(data)
        )
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json(err));
};
module.exports = {
  signInAuthentication: signInAuthentication,
  redisClient: redisClient
};
