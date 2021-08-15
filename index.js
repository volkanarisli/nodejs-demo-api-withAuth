const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

const bodyParser = require('body-parser');


require('dotenv/config')
//connect to db
mongoose.connect(
    process.env.DB_CONNECTION,
    { useUnifiedTopology: true },
    () => console.log('Db Connected')
);

//middlewares
app.use(cors());
app.use(bodyParser.json());

//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');


//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/post', postRoute);



app.listen(3000, () => console.log('Server is running'))