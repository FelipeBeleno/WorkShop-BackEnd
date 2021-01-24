const express = require('express');




const app = express();


app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./objetos'));
app.use(require('./cliente'));
app.use(require('./servicio'));
app.use(require('./procedimiento'))



module.exports = app;
