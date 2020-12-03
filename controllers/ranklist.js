const handleRankList = (req, res, db) => {

    return db('users')
    .select('name','entries')
    .orderBy('entries', 'desc')
    .limit(3)
    // .where( ROWNUM <= 3)
    .then(users => {
        console.log(users);
       return res.json(users);
    })


}

module.exports = {
    handleRankList: handleRankList
  };


// SELECT *
// FROM (SELECT customers.*
//       FROM customers
//       WHERE customer_id > 4500
//       ORDER BY last_name)
// WHERE ROWNUM < 3;