const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const varitas = {
  "Harry Potter": { // Clave modificada para facilitar la búsqueda
    dueño: "Harry Potter",
    madera: "Acebo",
    nucleo: "Pluma de Fénix",
    longitud: "11 pulgadas"
  },
  "Hermione Granger": { // Clave modificada para facilitar la búsqueda
    dueño: "Hermione Granger",
    madera: "Vid",
    nucleo: "Fibra de corazón de dragón",
    longitud: "10 3/4 pulgadas"
  },
  "Ron Weasley": { // Clave modificada para facilitar la búsqueda
    dueño: "Ron Weasley",
    madera: "Fresno",
    nucleo: "Pelo de unicornio",
    longitud: "12 pulgadas"
  },
  "Albus Dumbledore": { // Clave modificada para facilitar la búsqueda
    dueño: "Albus Dumbledore",
    madera: "Sauco",
    nucleo: "Pelo de cola de Thestral",
    longitud: "15 pulgadas"
  },
  "Lord Voldemort": { // Clave modificada para facilitar la búsqueda
    dueño: "Lord Voldemort",
    madera: "Tejo",
    nucleo: "Pluma de Fénix",
    longitud: "13 1/2 pulgadas"
  }
};

app.post('/webhook', (req, res) => {
  const intentName = req.body.queryResult.intent.displayName;

  if (intentName === 'InformacionSobreTienda') {
    const fulfillmentResponse = {
      fulfillmentText: 'HOLA! Somos la tienda de varitas mágicas!'
    };
    res.json(fulfillmentResponse);
  } else if (intentName === 'InformacionVaritasFamosas') {
    const nombreVarita = String(req.body.queryResult.parameters.nombreVarita);

    // Normalizar el nombre de la varita para la búsqueda
    const nombreNormalizado = nombreVarita.trim().toLowerCase();

    // Buscar la varita por dueño (nombre completo)
    let varitaEncontrada = varitas[nombreNormalizado];

    // Si no se encuentra por dueño, buscar por nombre o apellido
    if (!varitaEncontrada) {
      for (const nombre in varitas) {
        const dueño = varitas[nombre].dueño.toLowerCase();
        if (dueño.includes(nombreNormalizado)) {
          varitaEncontrada = varitas[nombre];
          break;
        }
      }
    }

    if (varitaEncontrada) {
      const fulfillmentResponse = {
        fulfillmentText: `Información sobre la varita de ${varitaEncontrada.dueño}:\n
          Madera: ${varitaEncontrada.madera}\n
          Núcleo: ${varitaEncontrada.nucleo}\n
          Longitud: ${varitaEncontrada.longitud}`
      };
      res.json(fulfillmentResponse);
    } else {
      const fulfillmentResponse = {
        fulfillmentText: `No se encontró información sobre la varita. 
        Asegúrate de que el nombre esté escrito correctamente (Nombre Apellido, por ejemplo "Harry Potter").`
      };
      res.json(fulfillmentResponse);
    }
  } else {
    res.json({});
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor webhook escuchando en el puerto ${PORT}`);
});