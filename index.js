require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { WebhookClient } = require('dialogflow-fulfillment');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// Configuracion del bot de Telegram
const token = process.env.TELEGRAM_BOT_TOKEN;
const telegramBot = new TelegramBot(token);

// Configuracion del agente de Dialogflow
process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.DIALOGFLOW_JSON_KEY_FILE;

app.post('/webhook', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  function dialogflowFulfillment(agent) {
    // Simplemente reenvia la respuesta de Dialogflow a Telegram
    agent.setResponse(agent.originalRequest.body.queryResult.fulfillmentMessages);
  }

  agent.handleRequest(dialogflowFulfillment);
});

// Ruta para verificar el bot de Telegram (opcional)
app.get('/telegram-verification', (req, res) => {
  res.send('¡Bot de Telegram verificado!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});