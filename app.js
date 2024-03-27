const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const catwayRoutes = require('./routes/catwayRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const path = require('path');


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté à MongoDB..."))
  .catch((err) => console.error("Impossible de se connecter à MongoDB...", err));

app.use(express.static(path.join(__dirname, "port-plaisance_html")));

app.use('/users', userRoutes);
app.use('/catways', catwayRoutes);
app.use('/reservations', reservationRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}...`);
});
module.exports = app;