const handleRankList = (req, res, db) => {

    return db('users')
    .select('name','entries')
    .orderBy('entries', 'desc')
    .limit(3)
    .then(users => {
       return res.json(users);
    })


}

module.exports = {
    handleRankList: handleRankList
  };

