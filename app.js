const express = require('express');
const app = express();
const port = 3000;
const movieRoutes = require("./routers/routes.js");


app.use(express.json());

app.use('/movies', movieRoutes);

app.get('/', (req, res) => {
    res.send('Ciao Carlo');
});

app.listen(port, () => {
    console.log(`App in ascolto sulla porta ${port}`);
});