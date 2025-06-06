const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRouter = require('./routers/authRouter')
const homepageRouter = require('./routers/homepageRouter');


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

MONGO_URL = process.env.MONGO_URL


mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Success connect MongoBD ✅"))
  .catch(err => console.log('Error Connect ❌', err));

//admin
app.use('/api/auth', authRouter)

//upimage n homepage
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/homepage', homepageRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port} 🚀`);
});


