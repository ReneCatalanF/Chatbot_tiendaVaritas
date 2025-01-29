require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { WebhookClient } = require('dialogflow-fulfillment');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// Configuración del bot de Telegram
console.log('Configurando bot de Telegram...');
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('Error: Variable de entorno TELEGRAM_BOT_TOKEN no definida.');
  process.exit(1);
}
const telegramBot = new TelegramBot(token);
console.log('Bot de Telegram configurado.');

// Configuración del agente de Dialogflow
console.log('Configurando agente de Dialogflow...');
if (!process.env.DIALOGFLOW_TYPE || !process.env.DIALOGFLOW_PROJECT_ID || !process.env.DIALOGFLOW_PRIVATE_KEY_ID || !process.env.DIALOGFLOW_PRIVATE_KEY || !process.env.DIALOGFLOW_CLIENT_EMAIL || !process.env.DIALOGFLOW_CLIENT_ID || !process.env.DIALOGFLOW_AUTH_URI || !process.env.DIALOGFLOW_TOKEN_URI || !process.env.DIALOGFLOW_AUTH_PROVIDER_X509_CERT_URL || !process.env.DIALOGFLOW_CLIENT_X509_CERT_URL) {
  console.error('Error: Variables de entorno de Dialogflow no definidas.');
  process.exit(1);
}
process.env.GOOGLE_APPLICATION_CREDENTIALS = {
  type: process.env.DIALOGFLOW_TYPE,
  project_id: process.env.DIALOGFLOW_PROJECT_ID,
  private_key_id: process.env.DIALOGFLOW_PRIVATE_KEY_ID,
  private_key: process.env.DIALOGFLOW_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
  client_id: process.env.DIALOGFLOW_CLIENT_ID,
  auth_uri: process.env.DIALOGFLOW_AUTH_URI,
  token_uri: process.env.DIALOGFLOW_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.DIALOGFLOW_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.DIALOGFLOW_CLIENT_X509_CERT_URL,
};
console.log('Agente de Dialogflow configurado.');

app.post('/webhook', (req, res) => {
  console.log('Solicitud recibida en /webhook:', req.body);

  const agent = new WebhookClient({ request: req, response: res });

  function dialogflowFulfillment(agent) {
    console.log('Intent detectado:', agent.intent);

    // Access Telegram chat ID from the Dialogflow request
    const chatId = agent.originalRequest.body.message.chat.id;  // Correct way to access chat ID

    // Send the Dialogflow response to Telegram
    telegramBot.sendMessage(chatId, agent.fulfillmentText);

    console.log('Respuesta enviada:', agent.fulfillmentText); // Log the actual response text
  }

  agent.handleRequest(dialogflowFulfillment);
});

// Ruta para verificar el bot de Telegram (opcional)
app.get('/telegram-verification', (req, res) => {
  console.log('Solicitud GET en /telegram-verification');
  res.send('¡Bot de Telegram verificado!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});