const express = require('express');
const bodyParser = require('body-parser');
const fuzzy = require('fuzzy');

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
    const input = String(req.body.queryResult.parameters.nombreVarita);



    // Normalizar el nombre de la varita (convertir a minúsculas y eliminar espacios extra)
    const inputNormalizado = input.toLowerCase().trim();
    console.log('Nombre normalizado:', inputNormalizado);

    //DUEÑO encontrado
    const dueñoEncontrado = "";

    // Recorrer el objeto varitas
    for (const key in varitas) {
      const dueñoNormalizado = key.toLowerCase(); // Normalizar el nombre del dueño

      // Dividir el nombre completo en partes (nombre y apellido)
      const partesDueño = dueñoNormalizado.split(" ");

      console.log('Nombre dueño normalizado:', dueñoNormalizado);
      console.log('Nombre dueño normalizado:', partesDueño.toString());

      // Verificar si el input coincide con el nombre completo, el nombre, el apellido, o cualquier parte
      if (
        dueñoNormalizado === inputNormalizado || // Coincide con el nombre completo
        partesDueño.some(parte => parte === inputNormalizado) || // Coincide con el nombre o apellido
        inputNormalizado.split(" ").some(parte => partesDueño.includes(parte)) // Coincide con cualquier parte del nombre
      ) {

        dueñoEncontrado = vartias[key];
        console.log('Dueño Encontrado:', dueñoEncontrado.toString());
        break;


      }
    }
    if (dueñoEncontrado != "") {

      // Utilizar el contexto para personalizar la respuesta (opcional)
      let respuesta = `Información sobre la varita de ${dueñoEncontrado.dueño}:\n`;
      respuesta += `Madera: ${dueñoEncontrado.madera}\n`;
      respuesta += `Núcleo: ${dueñoEncontrado.nucleo}\n`;
      respuesta += `Longitud: ${dueñoEncontrado.longitud}`;


      console.log("CREAMOS STRING DUEÑO ENCONTRADO: ", respuesta);
      const fulfillmentResponse = {
        fulfillmentText: respuesta
      };
      res.json(fulfillmentResponse);

    } else {

      console.log('No se encontró ninguna coincidencia para:', inputNormalizado);
      const fulfillmentResponse = {
        fulfillmentText: `No se encontró información sobre la varita. Por favor, verifica la ortografía o intenta con otro nombre.`
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