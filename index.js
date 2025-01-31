const express = require('express');
const bodyParser = require('body-parser');
const fuzzy = require('fuzzy');

const app = express();
app.use(bodyParser.json());

const varitas = {
  "Harry Potter": {
    dueño: "Harry Potter",
    madera: "Acebo",
    nucleo: "Pluma de fénix",
    longitud: "11 pulgadas",
    descripcion: "Varita elegida por Harry en Ollivanders, conocida por su lealtad y su capacidad para realizar hechizos poderosos."
  },
  "Lord Voldemort": {
    dueño: "Lord Voldemort",
    madera: "Tejo",
    nucleo: "Pluma de fénix",
    longitud: "13 1/2 pulgadas",
    descripcion: "Una varita oscura y poderosa, capaz de realizar hechizos malignos. Hermana de la varita de Harry."
  },
  "Albus Dumbledore": {
    dueño: "Albus Dumbledore",
    madera: "Sauco",
    nucleo: "Pelo de cola de Thestral",
    longitud: "15 pulgadas",
    descripcion: "Una de las Reliquias de la Muerte, conocida por su poder y sabiduría."
  },
  "Hermione Granger": {
    dueño: "Hermione Granger",
    madera: "Vid",
    nucleo: "Fibra de corazón de dragón",
    longitud: "10 3/4 pulgadas",
    descripcion: "Una varita elegante y precisa, ideal para hechizos complejos."
  },
  "Ron Weasley": {
    dueño: "Ron Weasley",
    madera: "Fresno",
    nucleo: "Pelo de unicornio",
    longitud: "12 pulgadas",
    descripcion: "Una varita leal y confiable, aunque a veces un poco caprichosa."
  },
  "Draco Malfoy": {
    dueño: "Draco Malfoy",
    madera: "Boj",
    nucleo: "Corazón de basilisco",
    longitud: "10 pulgadas",
    descripcion: "Una varita oscura y arrogante, reflejando la personalidad de su dueño."
  },
  "Luna Lovegood": {
    dueño: "Luna Lovegood",
    madera: "Laurel",
    nucleo: "Vela de corazón de tentáculo de kraken",
    longitud: "13 pulgadas",
    descripcion: "Una varita excéntrica y única, capaz de realizar hechizos inusuales."
  },
  "Neville Longbottom": {
    dueño: "Neville Longbottom",
    madera: "Haya",
    nucleo: "Cola de unicornio",
    longitud: "14 pulgadas",
    descripcion: "Una varita leal y confiable, que crece en poder junto con su dueño."
  },
  "Sirius Black": {
    dueño: "Sirius Black",
    madera: "Roble",
    nucleo: "Cola de fénix",
    longitud: "12 pulgadas",
    descripcion: "Una varita poderosa y versátil, utilizada por un animago experto."
  },
  "Minerva McGonagall": {
    dueño: "Minerva McGonagall",
    madera: "Roble",
    nucleo: "Corazón de dragón",
    longitud: "13 pulgadas",
    descripcion: "Una varita poderosa y versátil, ideal para profesores de Transformaciones."
  },
  "Remus Lupin": {
    dueño: "Remus Lupin",
    madera: "Fresno",
    nucleo: "Pelo de unicornio",
    longitud: "11 pulgadas",
    descripcion: "Una varita leal y confiable, que acompaña a su dueño en sus aventuras."
  },
  "Bellatrix Lestrange": {
    dueño: "Bellatrix Lestrange",
    madera: "Ebony",
    nucleo: "Vena de serpiente",
    longitud: "12.5 pulgadas",
    descripcion: "Una varita oscura y poderosa, utilizada para realizar hechizos crueles y tortuosos."
  },
  "Severus Snape": {
    dueño: "Severus Snape",
    madera: "Ciprés",
    nucleo: "Cola de fénix",
    longitud: "11 pulgadas",
    descripcion: "Una varita elegante y letal, capaz de realizar hechizos complejos y precisos."
  },
  "Rubeus Hagrid": {
    dueño: "Rubeus Hagrid",
    madera: "Roble",
    nucleo: "Pelo de unicornio",
    longitud: "16 pulgadas",
    descripcion: "Una varita robusta y poderosa, ideal para tareas que requieren fuerza bruta."
  },
  "Ginny Weasley": {
    dueño: "Ginny Weasley",
    madera: "Yew",
    nucleo: "Corazón de dragón",
    longitud: "11 pulgadas",
    descripcion: "Una varita poderosa y versátil, que refleja la valentía y determinación de su dueña."
  },
  "Charlie Weasley": {
    dueño: "Charlie Weasley",
    madera: "Roble",
    nucleo: "Cola de dragón",
    longitud: "14 pulgadas",
    descripcion: "Una varita resistente y duradera, ideal para trabajos de campo y criaturas mágicas."
  },
  "Bill Weasley": {
    dueño: "Bill Weasley",
    madera: "Haya",
    nucleo: "Pelo de unicornio",
    longitud: "13 pulgadas",
    descripcion: "Una varita elegante y versátil, utilizada para una variedad de hechizos."
  },
  "Fred y George Weasley": {
    dueños: "Fred y George Weasley",
    madera: "Nogal",
    núcleo: "Cola de fénix",
    longitud: "12 pulgadas",
    descripcion: "Un par de varitas idénticas, utilizadas para crear bromas y artilugios mágicos."
  },
  "Cho Chang": {
    dueño: "Cho Chang",
    madera: "Cerezo",
    núcleo: "Corazón de dragón",
    longitud: "11 pulgadas",
    descripcion: "Una varita elegante y ligera, ideal para hechizos de vuelo y defensa."
  },
  "Lucius Malfoy": {
    dueño: "Lucius Malfoy",
    madera: "Ebony",
    núcleo: "Vena de serpiente",
    longitud: "13 pulgadas",
    descripcion: "Una varita oscura y elegante, que refleja el estatus social de su dueño."
  },
  "Nymphadora Tonks": {
    dueño: "Nymphadora Tonks",
    madera: "Sauce llorón",
    núcleo: "Vela de corazón de mantícora",
    longitud: "12 pulgadas",
    descripcion: "Una varita versátil y adaptable, que refleja la naturaleza cambiante de su dueña."
  },
  "Oliver Wood": {
    dueño: "Oliver Wood",
    madera: "Fresno",
    núcleo: "Cola de unicornio",
    longitud: "14 pulgadas",
    descripcion: "Una varita resistente y confiable, ideal para deportes mágicos."
  },
  "Cornelius Fudge": {
    dueño: "Cornelius Fudge",
    madera: "Roble",
    núcleo: "Corazón de dragón",
    longitud: "13 pulgadas",
    descripcion: "Una varita que refleja la personalidad ambigua y oportunista de su dueño."
  },
  "Alastor Moody (Ojoloco)": {
    dueño: "Alastor Moody",
    madera: "Haya",
    núcleo: "Pelo de unicornio",
    longitud: "12 pulgadas",
    descripcion: "Una varita resistente y confiable, utilizada por un Auror experimentado."
  },
  "Barty Crouch Jr.": {
    dueño: "Barty Crouch Jr.",
    madera: "Ebony",
    núcleo: "Vena de serpiente",
    longitud: "11 pulgadas",
    descripcion: "Una varita oscura y poderosa, utilizada para realizar hechizos malignos."
  },
  "Lucius Malfoy (varita original)": {
    dueño: "Lucius Malfoy (joven)",
    madera: "Laurel",
    núcleo: "Vena de dragón",
    longitud: "12 pulgadas",
    descripcion: "La primera varita de Lucius Malfoy, antes de obtener la de Voldemort."
  },
  "Dolores Umbridge": {
    dueño: "Dolores Umbridge",
    madera: "Avellano",
    núcleo: "Pena de fénix",
    longitud: "9 pulgadas",
    descripcion: "Una varita elegante pero oscura, reflejando la personalidad cruel de su dueña."
  },
  "Peter Pettigrew (Colagusano)": {
    dueño: "Peter Pettigrew",
    madera: "Abedul",
    núcleo: "Pelo de rata",
    longitud: "10 pulgadas",
    descripcion: "Una varita débil y poco confiable, reflejando la cobardía de su dueño."
  },
  "Quirrell": {
    dueño: "Quirrell",
    madera: "Olmo",
    núcleo: "Pelo de unicornio",
    longitud: "11 pulgadas",
    descripcion: "Una varita sencilla, utilizada por un mago débil y cobarde."
  },
  "Gilderoy Lockhart": {
    dueño: "Gilderoy Lockhart",
    madera: "Laurel",
    núcleo: "Plumas de pavo real",
    longitud: "12 pulgadas",
    descripcion: "Una varita vistosa pero ineficaz, utilizada por un mago vanidoso y mentiroso."
  },
  "Argus Filch": {
    dueño: "Argus Filch",
    madera: "Roble",
    núcleo: "Espina de puercoespín",
    longitud: "14 pulgadas",
    descripcion: "Una varita robusta, utilizada para mantener el orden en Hogwarts."
  },
  "Madame Hooch": {
    dueño: "Madame Hooch",
    madera: "Fresno",
    núcleo: "Cola de unicornio",
    longitud: "12 pulgadas",
    descripcion: "Una varita precisa y confiable, ideal para enseñar Quidditch."
  },
  "Vernon Dursley": {
    dueño: "Vernon Dursley",
    madera: "Roble",
    núcleo: "Pelo de jabalí",
    longitud: "15 pulgadas",
    descripcion: "Una varita tosca y poco mágica, reflejando la personalidad grosera de su dueño."
  },
  "Petunia Dursley": {
    dueño: "Petunia Dursley",
    madera: "Haya",
    núcleo: "Espina de erizo",
    longitud: "10 pulgadas",
    descripcion: "Una varita débil y poco mágica, utilizada para tareas domésticas."
  },
  "Newt Scamander": {
    dueño: "Newt Scamander",
    madera: "Nogal",
    núcleo: "Cola de erizo",
    longitud: "12 pulgadas",
    descripcion: "Una varita versátil y resistente, ideal para trabajar con criaturas mágicas."
  },
  "Gellert Grindelwald": {
    dueño: "Gellert Grindelwald",
    madera: "Sauco",
    núcleo: "Pelo de cola de Thestral",
    longitud: "14 pulgadas",
    descripcion: "Una de las Reliquias de la Muerte, conocida por su poder y oscuridad."
  },
  "Leta Lestrange": {
    dueño: "Leta Lestrange",
    madera: "Ebony",
    núcleo: "Vena de serpiente",
    longitud: "11 pulgadas",
    descripcion: "Una varita oscura y poderosa, reflejando su conexión con la familia Lestrange."
  },
  "Tina Goldstein": {
    dueño: "Tina Goldstein",
    madera: "Roble",
    núcleo: "Corazón de dragón",
    longitud: "13 pulgadas",
    descripcion: "Una varita fuerte y confiable, utilizada por una Auror experta."
  },
  "Queenie Goldstein": {
    dueño: "Queenie Goldstein",
    madera: "Laurel",
    núcleo: "Vela de corazón de mantícora",
    longitud: "12 pulgadas",
    descripcion: "Una varita elegante y versátil, capaz de realizar hechizos encantadores."
  },
  "Jacob Kowalski": {
    dueño: "Jacob Kowalski",
    madera: "Nogal",
    núcleo: "Cola de unicornio",
    longitud: "11 pulgadas",
    descripcion: "Una varita simple y confiable, utilizada por un No-Maj."
  },
  "Credence Barebone": {
    dueño: "Credence Barebone",
    madera: "Tejo",
    núcleo: "Pelo de Obscurus",
    longitud: "15 pulgadas",
    descripcion: "Una varita oscura y poderosa, conectada a una fuerza oscura."
  },
  "Theseus Scamander": {
    dueño: "Theseus Scamander",
    madera: "Haya",
    núcleo: "Cola de fénix",
    longitud: "13 pulgadas",
    descripcion: "Una varita elegante y poderosa, utilizada por un Auror experimentado."
  },
  "Viktor Krum": {
    dueño: "Viktor Krum",
    madera: "Nogal",
    núcleo: "Cola de dragón",
    longitud: "13 pulgadas",
    descripcion: "Una varita poderosa y resistente, ideal para el juego de Quidditch y los hechizos defensivos."
  },
  "Cedric Diggory": {
    dueño: "Cedric Diggory",
    madera: "Cedro",
    núcleo: "Cola de unicornio",
    longitud: "12 pulgadas",
    descripcion: "Una varita elegante y poderosa, conocida por su capacidad para realizar hechizos complejos."
  },
  "Nicolas Flamel": {
        dueño: "Nicolas Flamel",
        madera: "Roble",
        núcleo: "Vena de dragón",
        longitud: "14 pulgadas",
        descripcion: "Una varita antigua y poderosa, capaz de realizar hechizos de transmutación y alquimia."
    },
};

function buscarVarita(nombreNormalizado, varitas) {
  const regex = new RegExp(nombreNormalizado, 'i'); // Búsqueda insensible a mayúsculas y minúsculas
  for (const key in varitas) {
    if (key.match(regex)) {
      return varitas[key];
    }
  }
  return null;
}

app.post('/webhook', (req, res) => {
  const intentName = req.body.queryResult.intent.displayName;

  if (intentName === 'InformacionSobreTienda') {
    const fulfillmentResponse = {
      fulfillmentText: 'No seas un mago sin varita. ¡Ven a nuestro caldero y encuentra la tuya! \nSomos el Caldero No Chorreante ubicados en la calle Gringotts 17 \n\nDueño actual René Ignacio Catalán Figueroa, un Saludo!'
    };
    res.json(fulfillmentResponse);
  } else if (intentName === 'InformacionVaritasFamosas') {
    console.log(req.body);
    const input = req.body.queryResult.parameters.nombreVarita;
    console.log("nombre sin normalizar: ", input)
    // Validación del nombre (ya que es obligatorio)
    if (!input) {
      res.json({
        fulfillmentText: 'Por favor, indica el nombre del mago/bruja.'
      });

    } else {
      // Normalizar el nombre de la varita (convertir a minúsculas y eliminar espacios extra)
      const inputNormalizado = input.toLowerCase().trim();
      console.log('Nombre normalizado:', inputNormalizado);

      //DUEÑO encontrado
      const varitaEncontrada = buscarVarita(inputNormalizado, varitas);


      if (varitaEncontrada) {

        // Utilizar el contexto para personalizar la respuesta (opcional)
        let respuesta = `Información sobre la varita de ${varitaEncontrada.dueño}:\n`;
        respuesta += `Madera: ${varitaEncontrada.madera}\n`;
        respuesta += `Núcleo: ${varitaEncontrada.nucleo}\n`;
        respuesta += `Longitud: ${varitaEncontrada.longitud}\n`;
        respuesta += `Descripción: ${varitaEncontrada.descripcion}\n\n`;
        respuesta += `Si quieres saber sobre otras varitas, vuelve a saludarnos!`;


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
    }
  } else {
    res.json({});
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor webhook escuchando en el puerto ${PORT}`);
});