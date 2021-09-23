require('./config/config')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(require('./controllers/index'));

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'App en funcionamiento'
    })
})






mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        throw err;
    }
    console.log('Base de datos ONLINE');
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando desde el puerto ${process.env.PORT}`);
})


