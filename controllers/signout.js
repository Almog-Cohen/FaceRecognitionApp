const redis = require("redis");

//setup reddis
const redisClient = redis.createClient(process.env.REDIS_URL);


// Remove user token when he signout
const removeToken = (req, res) => {
  const { authorization } = req.headers;

  return redisClient.del(authorization, (err, replay) => {
      if (err || !replay) {
        return res.status(400).json("Unautthorized");
      }
      return res.json('Deleted token in redis');
    });

};

module.exports = {
  removeToken: removeToken,
};
