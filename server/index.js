const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRouter = require('./routers/authRouter')
const homepageRouter = require('./routers/homepageRouter');
const imageRouter = require('./routers/imageRouter');
const musicRouter = require('./routers/musicRouter');
const playlistRouter = require('./routers/playlistRouter');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

MONGO_URL = process.env.MONGO_URL


// set dns

const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);
// -------------------------

mongoose.connect(MONGO_URL)
  .then(() => console.log("Success connect MongoBD ✅"))
  .catch(err => console.log('Error Connect ❌', err));

app.use('/api/auth', authRouter)

app.use('/api/homepage', homepageRouter);
app.use('/api/image', imageRouter);
app.use('/api/music', musicRouter);
app.use('/api/playlist', playlistRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port} 🚀`);
});