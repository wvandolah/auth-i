const router = require("express").Router();
const bcrypt = require('bcryptjs');
const db = require('../database/dbConfig.js');


function protected(req, res, next) {
    if (req.session && req.session.username){
        next()
    }else {
        res.status(401).json({message: 'no no no'})
    }
}

router.post('/register', (req, res) =>{
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 10);
  
    creds.password = hash;
  
    db('users').insert(creds).then(ids => {
      const id = ids[0];
      res.status(201).json(id);
    }).catch(err => res.status(500).send(err))
});
  
router.post('/login', (req, res) => {
    const creds = req.body;
  
    db('users')
        .where({username: creds.username})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.username = user.username;
                res.status(200).json({ message: 'Welcome!', username: req.session.username})
            } else {
                res.status(401).json({ message: 'You shall not pass!'})
            }
        }).catch(err => res.status(500).send(err))
    })
  
  // protect this route, only authenticated users should see it
  router
    .route('/')
    .get(protected, (req, res) => {
        db('users')
            .select('id', 'username', 'password')
            .then(users => {
                res.json(users);
            })
        .catch(err => res.send(err));
  });


module.exports = router;