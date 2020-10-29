const express = require('express');
const app = express();
const jellybeanBag = require('./data')

app.use(express.static('public'));


//registramos la función de middleware
app.use((req, res, next) => {
  console.log(`middleware : ${req.method} Request Received`);
  next()
})

//app.use() a nivel de ruta, código que se ejecutara solo cuando 
//el cliente se encuentre en el endponint  /beans/:beanName
app.use('/beans/:beanName', (req, res, next) => {
  console.log('entre porque si hago match con la ruta solicitada por el cliente')
  const name = req.params.beanName;
  const oso = jellybeanBag[name];
  if(!oso) return res.status(404).send('Oso con ese nombre no existe =)');
  req.bean = oso;
  req.beanName = name; 
  next();
})


// Add your code below:
app.use(['/beans/', '/beans/:beanName'], (req, res, next) => {
  //Siempre que enviemos data en el body
  let bodyData = '';
  req.on('data', (data) => {
    bodyData += data;
  });
  req.on('end', () => {
    if (bodyData) {
      req.body = JSON.parse(bodyData);
    }
    next();
  });
});


//Rutas 
/* Obtienes todos los osos*/
app.get('/beans/', (req, res, next) => {
  res.send(jellybeanBag);
  console.log('Response Sent');
})

//Obtener oso por nombre
app.get('/beans/:beanName', (req, res, next) => {
  res.send(req.bean);
  console.log('Response Sent');
});

//Crear un odo
app.post('/beans/', (req, res, next) => {
  const body = req.body; //viene del middleware
  const beanName = body.name;
  //verificamos que el nombre del oso no se repita
  if (jellybeanBag[beanName] || jellybeanBag[beanName] === 0) {
    return res.status(400).send('Bag with that name already exists!');
  }
  //Si no envias un número por default se tiene stock 0
  const numberOfBeans = Number(body.number) || 0;
  // Creas la nueva propiedad y su valor
  jellybeanBag[beanName] = {
    number: numberOfBeans
  };
  res.send(jellybeanBag[beanName]);
  console.log('Response Sent');
});

//Aumentar el stock de osos
app.post('/beans/:beanName/add', (req, res, next) => {
  console.log(req.body);
  const numberOfBeans = Number(req.body.number) || 0;
  req.bean.number += numberOfBeans;
  res.send(req.bean);
  console.log('Response Sent');
});


//Eliminar una cantidad de osos, disminuir el stock de osos
app.post('/beans/:beanName/remove', (req, res, next) => {
  const numberOfBeans = Number(req.body.number) || 0;
  if (req.bean.number < numberOfBeans) {
    return res.status(400).send('Not enough beans in the jar to remove!');
  }
  req.bean.number -= numberOfBeans;
  res.send(req.bean);
  console.log('Response Sent');
});

app.put('/beans/:beanName/name', (req, res, next) => {
  const newName = req.body.name;
  jellybeanBag[newName] = req.bean;
  jellybeanBag[req.beanName] = null
  res.send(jellybeanBag[newName]);
  console.log('Response Sent');
});


//Borrar un oso de la base de datos
app.delete('/beans/:beanName', (req, res, next) => {
  jellybeanBag[req.beanName] = null;
  res.status(204).send();
  console.log('Response Sent');
});


const PORT = 4001 || process.env.PORT;


app.listen(PORT, () => {
  console.log(`Server listenning in port ${PORT}`)
})