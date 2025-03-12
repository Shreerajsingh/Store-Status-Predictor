const dotenv = require('dotenv');
const express = require('express');
const reportRouter = require('./routes/reportRoutes');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: true}));

app.use('/api', reportRouter);

app.listen(process.env.PORT, async () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})