const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const intentName = req.body.queryResult.intent.displayName;

  if (intentName === 'InformaciónSobreTienda') { // Reemplaza 'XX' con el nombre de tu intent
    const fulfillmentResponse = {
      fulfillmentText: 'Somos Tienda Varita Mágica, un gusto!'
    };
    res.json(fulfillmentResponse);
  } else {
    // Para otros intents, puedes enviar una respuesta vacía o una respuesta predeterminada
    res.json({});
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor webhook escuchando en el puerto ${PORT}`);
});