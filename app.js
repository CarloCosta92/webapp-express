const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Ciao Carlo');
});

app.listen(port, () => {
    console.log(`App in ascolto sulla porta ${port}`);
});