require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const postRoute = require('./routes/posts');
const bodyParser = require('body-parser');
const cors = require('cors');


const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

//MIDDLEWARE
app.use(express.json());
app.use(bodyParser.json());
app.use('/posts', cors(corsOptions), postRoute);
app.use(cors(corsOptions));

//ROUTES
app.get('/', (req, res) => {
    res.send('We are on HOME');
});

app.get('/posts', cors(corsOptions), function (req, res) {
    res.send('ABOUT ME');
})

// CONNECTION TO DB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Connected to database'));


//LISTENNING TO THE SERVER
app.listen(3002);