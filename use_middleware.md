# Middlewares en express

1.- Vemos que el manejador de rutas está con demasiado código y este se repite en todos 
los manejadores.

2.- Empezaremos con los console.log, abstraeremos en una función y reutilizaremos en cada uno de los manejadores de rutas.

3.- Hemos colocado la misma llamada de función una y otra vez y por lo tanto seguimos
repitiendonos. **¿Cómo conseguimos que que dicha función se ejecute cada vez que llamamos a una ruta express sin repertirnos?** pues utilizando el **middleware**

`El middleware` es un código que se ejecuta entre el servidor que recibe una solicitud y envía una respuesta. Opera en el límite de estas dos acciones HTTP.

## ¿Qué cosas pueden hacer los middleares en express?

- En express el `middleware` es una función 
- Dentro de esta función tu puedes escribir lógica en los objetos **req** y **res**
como por ejemplo : 
    - inspeccionar un `request(solicitud)`
    - realizar alguna lógica basasa en el `request`
    - enviar la respuesta al usuario
    - pasar el `request` y el `response` a otro **middleware**

**El middleware puede hacer cualquier combinación de esas cosas o cualquier cosa que puede hacer una función js**

```js
const middleware =  (req, res, next) => {
  console.log('Request received')
}
// Se registra la función de middleware en app.use
app.use(middleware)
```

En el ejemplo: 
- `app.use()` toma como parámetro una función de callback que invocará para cada 
`request` que realice el cliente(navegador)-
- Cada vez que el servidor reciba una solicitud(request) encuentra la primera función de middleware registrada y la invocará. En este caso encontrará la función de callback e imprimirá en consola `request received`

- `next()` indica que se pase al siguiente middleware.

- En express lo que tu indicas es una pila de `middlewares` en donde la ejecución 
es de arriba hacia abajo.

- Los middlewares se pueden registrar en cualquier método. `app.use()`
`app.get()`, `app.post()`, etc.


4.- Utilizaremos `app.use()` a nivel de ruta. Es decir, queremos que se siempre se ejecute cierta lógica cuando el usuario se ubique en el path `/beans/:beanName` indistintamente del método http que este esté enviando como solicitud.

Por lo tanto, lo que queremos hacer, es que **siempre que el cliente** vaya al endpoint `/beans/:beanName` se verifique lo siguiente :
- el nombre de oso que envía como parámetro está registrado en la base de datos,
- si ese nombre no existe, que se envíe la respuesta y el código de estado `404`
- si existe, vamos a asociar al objeto **req** la propiedad **bean** cuyo valor será el objeto guardado para ese oso en la base de datos.
- si existe, también vamos a asociar al objeto **req** la propiedad **beanName** cuyo valor será el nombre que viene como parámetro
- finalmente lo pasaremos al siguiente middleware, con next()

necesitamos validar que el nombre que se envía como parámetro en el path tenga un objeto asociado en la base de datos. 


5.- Se observa que en cada manejador de ruta **put** y **post** hay código que se 
repite. 