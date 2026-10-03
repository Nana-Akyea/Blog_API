require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./database/connectDB');
const logRequest = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const ArticleRoutes = require('./routes/article.route.js');


const app = express();

const PORT = process.env.PORT;

connectDB();

app.use(express.json());

app.use(cors('*'));

app.use(logRequest);

app.use('/api', ArticleRoutes);


app.use(errorHandler);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});