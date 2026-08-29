# GDS Training · adaptación web

Esta primera adaptación presenta en navegador los contenidos originales del simulador DOS, sin duplicar ni modificar las lecciones. Lee los ficheros de `orion/GDS/` cuando se sirve la carpeta del proyecto por HTTP.

## Uso local

Publique o abra la carpeta `GDS` con cualquier servidor web estático y visite la raíz (`/`). Por ejemplo, la extensión **Live Server** de VS Code o cualquier alojamiento estático corporativo. No requiere instalar dependencias ni base de datos para esta fase. El navegador ofrecerá instalarla en equipos y móviles compatibles; al instalarse descarga también los DAT para trabajar sin conexión.

> No abra `index.html` directamente como archivo: los navegadores bloquean la lectura de las lecciones por motivos de seguridad. Debe abrirse mediante un servidor web o un alojamiento web con HTTPS.

## Incluido

- Los tres modos y sus 40 lecciones, cargados desde los DAT originales.
- Classroom y Agency guiados: no se avanza hasta escribir una orden válida.
- Review: diez preguntas, corrección inmediata y soluciones al terminar; solo queda completada con cero errores.
- Progreso guardado exclusivamente en el navegador del estudiante.
- Buscador de órdenes y conceptos que indexa los comandos presentes en las lecciones.

## Próxima fase sugerida

Separar los datos didácticos de los DAT a un formato editable, añadir usuarios sincronizados para acreditar el progreso y conectar un catálogo versionado de códigos Amadeus. Así podrán actualizarse códigos y ejemplos sin alterar el motor de aprendizaje.
