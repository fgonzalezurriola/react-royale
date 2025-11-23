# Entrega

Este documento contiene el informe pedido para el hito 3, con el fin de separar lo que iría en un readme de un proyecto con lo que se pide
para la entrega.

## Tema del proyecto

React Royale es una plataforma web fullstack para organizar competencias de componentes de React. La aplicación permite crear competencias
 con un tiempo límite y bajo cierta temática para que los usuarios puedan participar.

Los participantes pueden subir sus componentes para participar en la competencia. Al terminar el tiempo de participación, comienza el
tiempo de votación, en donde los usuarios pueden votar por su componente favorito. Al terminar el tiempo de votación, se muestran los
componentes en orden de más votado y se cierra la competencia.

## Repositorio de GitHub

El proyecto está alojado en el siguiente #link("https://github.com/fgonzalezurriola/react-royale")[repositorio público de GitHub]. Los
desarrollos correspondientes a este hito se encuentran en la rama `hito3`.

## Manejo de Estado

Usamos Zustand, creamos las stores de useAuthStore, useHackatonStore y useSubmissionStore, refactorizamos, eliminando tres custom hooks
y el react context que usaba Auth. 

// Todo: diagrama

//#figure(
//  image("images/landing0.png", height:7cm),
//  caption: [Pantalla principal]
//)

## Rutas y Autenticación

// Todo

## Test e2e

Usamos playwright

// Todo: todo

...

...

## Estilos

Usamos Shadcn + tailwindCSS desde el hito 1, del registro de shadcn usamos algunos componentes de magicUI, mientras que para el resto
usamos el registro predeterminado por @shadcn y alteramos los estilos a nuestro gusto.

// Todo: explicar diseño (base shadcn + landing bonita con paleta de colores X y z)

## Deploy

```sh
# Construir
cd backend
npm run build:ui
npm run build

# Copiar el .env.example a lo siguiente
# Esto es todo lo necesario (no olvidar añadir un JWT_SECRET= secreto)
MONGODB_URI=mongodb://fulls:fulls@fullstack.dcc.uchile.cl:27019
MONGODB_DBNAME=fullstack
PORT=7137
HOST=0.0.0.0
FRONTEND_URL=https://fullstack.dcc.uchile.cl:7137
CORS_ORIGINS=https://fullstack.dcc.uchile.cl:7137

# Subir al servidor lo necesario
ssh -p 219 fullstack@fullstack.dcc.uchile.cl "mkdir -p react-royale/backend"
scp -P 219 -r dist package.json package-lock.json .env \
  fullstack@fullstack.dcc.uchile.cl:react-royale/backend/

# Instalar sólo dependencias necesarias y correr proceso node
ssh -p 219 fullstack@fullstack.dcc.uchile.cl
cd react-royale/backend
npm install --production # O npm install --omit=dev
screen -S react-royale
npm run start
```

Por último ir a `https://fullstack.dcc.uchile.cl:7137/`

## Aclaraciones

En el desarrollo del proyecto nos dimos cuenta que la librería de react-live no es totalmente segura, y que el uso de sandboxes de
código para evitar vulnerabilidades es un tema bien complicado de implementar. En primer lugar tratamos de migrar a la librería sandpack,
pero la refactorización tomaba mucho esfuerzo y código, por lo que sanitizamos el input del usuario intentando que no se suba código
malicioso. En el hipotético caso de un proyecto real deberíamos aplicar alguna medida segura para evitar ejecución de código js a los
usuarios, ya sea aplicando todas las medidas que integra sandpack o aplicando un sistema de revisión y moderación.

