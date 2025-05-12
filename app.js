const express = require('express');
const app = express();
const port = 3000;
const movieRoutes = require("./routers/routes.js");
const errorHandler = require('./middlewares/errorHandler.js');
const notFound = require('./middlewares/notFound.js');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173'
}));
//Middleware per file statici
app.use(express.static("./public"))

//Middleware per formato JSON
app.use(express.json());

app.use('/movies', movieRoutes);

app.get('/', (req, res) => {
    res.send('Ciao Carlo');
});

// middleware errori
app.use(errorHandler);

// middleware rotte non trovate
app.use(notFound);

app.listen(port, () => {
    console.log(`App in ascolto sulla porta ${port}`);
});