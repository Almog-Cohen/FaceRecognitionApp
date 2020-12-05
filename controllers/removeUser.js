const { response } = require("express");
const redis = require("redis");

//setup reddis
const redisClient = redis.createClient(process.env.REDIS_URI);


// Delete user from data base and user token from redis
const removeUserData = (req, res, db) => {
  const { authorization } = req.headers;
  const { id } = req.params;

  redisClient.del(authorization, (err, replay) => {
    if (err || !replay) {
      return replay;
    }
    return replay;
  });

  db("users")
    .where("id", id)
    .del()
    .then((res) => console.log(res));
  db("login")
    .where("id", id)
    .del()
    .then((res) => console.log(res));

  return res.json("DELETED USER");
};

module.exports = {
  removeUserData: removeUserData,
};
