const express = require('express');
const cors = require('cors');
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('./database/dbConfig.js');
const server = express();
const userController = require('./routes/userRoutes')
const sessionConfig = {
    name: 'monkey', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000, // a day
        secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60,
    }),
};

server.use(express.json());
server.use(cors());
server.use(session(sessionConfig))


server.use('/api/users', userController)

server.get('/', (req, res) => {
    res.send('Its Alive!');
  });




const port = 3300
server.listen(port, () => console.log('\nrunning on port 3300\n'));