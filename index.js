require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { WebhookClient } = require('dialogflow-fulfillment');
const TelegramBot = require('node-telegram-bot-api');
const { SessionsClient } = require('@google-cloud/dialogflow-cx');

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
process.env.GOOGLE_APPLICATION_CREDENTIALS = JSON.stringify( {
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
});
console.log('Agente de Dialogflow configurado.');

const dialogflowClient = new SessionsClient();

app.post('/webhook', (req, res) => {
  console.log('Solicitud recibida en /webhook:', req.body);

  // Verificar si el cuerpo de la solicitud contiene un mensaje de Telegram
  if (!req.body.message || !req.body.message.text) {
    console.log("No se recibió ningún mensaje de texto de Telegram. Ignorando.");
    return res.sendStatus(200); // Responder a Telegram para evitar reintentos
  }

  const telegramMessage = req.body.message.text; // Texto del mensaje del usuario
  const chatId = req.body.message.chat.id;      // ID del chat de Telegram

  // Crear un objeto de solicitud en el formato que Dialogflow espera
  const dialogflowRequest = {
    session: `projects/${process.env.DIALOGFLOW_PROJECT_ID}/locations/global/agent/sessions/${chatId}`,
    queryInput: {
      text: {
        text: telegramMessage,
      },
      languageCode: 'es-ES',
    },
  };

  console.log('Solicitud a DialogFlow: ',dialogflowRequest);
  // Crear el agente de Dialogflow con la solicitud transformada
  //const agent = new WebhookClient({ request: { body: dialogflowRequest }, response: res });


  
  dialogflowClient.detectIntent(dialogflowRequest)
    .then(dialogflowResponse => {
      console.log('Respuesta de Dialogflow:', dialogflowResponse);

      const fulfillmentText = dialogflowResponse.queryResult.fulfillmentText;

      telegramBot.sendMessage(chatId, fulfillmentText)
        .then(() => {
          console.log('Respuesta enviada a Telegram:', fulfillmentText);
        })
        .catch(error => {
          console.error('Error al enviar mensaje a Telegram:', error);
        });
    })
    .catch(error => {
      console.error('Error al contactar a Dialogflow:', error);
      res.status(500).send('Ocurrió un error al procesar la solicitud.');
    });
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