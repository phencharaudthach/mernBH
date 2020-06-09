// bring in express, initialize express, listen to port 5000
//extra use cors, accept json, have port check PORT envirnment variable first
const express = require('express');
const app = express();
const cors = require("cors");
const config = require("./config");
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

const users = require('./routes/api/users');

app.use('/api/users', users);

mongoose.connect(config.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
},
() => console.log("connected to database"));

const port = process.env.PORT || 5000;

app.listen(5000, () => console.log(`Server Started ${port}`));