# Hito 3, "React Royale"
---
## Informacion Preliminar
Curso: Aplicaciones Web Reactivas (CC5003)

Fecha de entrega (plazo maximo): 23 de Noviembre de 2025

### Integrantes
- Sergio Romero Véliz
- Francisco González Urriola
- Jorge Cummins Holger
  
### Cuerpo docente
- Profesor de Catedra: Matías Toro
- Profesor(es) Auxiliar(es): Ignacio Cornejo, Carlos Ruz

--- 
## Sobre el Repositorio
### Introduccion
El presente repositorio cuenta con el proyecto realizado para el curso "Aplicaciones Web Reactivas" durante el semestre de primavera de 2025. Esta entrega corresponde al 3er (y ultimo) hito del proyecto previo a la presentacion final donde se hace uso de todas las herramientas integradas durante el semestre para la realizacion de una aplicacion web. Es importante mencionar que, comparado a otras ocaciones donde se realizaba la entrega de un informe con respecto al hito del proyecto, el `README` del repositorio corresponde al informe para esta entrega siguiendo las instrucciones del cuerpo docente.

El proyecto está alojado en el siguiente [repositorio público de GitHub](https://github.com/fgonzalezurriola/react-royale). Los desarrollos correspondientes a este hito se encuentran en la rama `hito3`.

## Tema del proyecto
"React Royale" es una plataforma web fullstack para organizar competencias de componentes de React. La aplicación permite crear competencias con un tiempo límite y bajo cierta temática para que los usuarios puedan participar.

Los participantes pueden subir sus componentes para participar en una competencia (o hackaton) durante un tiempo determinado por otra persona que creo la competencia. Al terminar el tiempo de participación, comienza el
periodo de votación, en donde los usuarios pueden votar por su componente favorito (solo una). Al terminar el tiempo de votación, se muestran los componentes en orden de más votado y se cierra la competencia.

## Estructura del Estado Global
Para la realizacion de la aplicacion, se utilizo Zustand para el manejo de estados, lo que permitio eliminar tres hooks y el react context que usaba `Auth`.

### Stores
Se crearon tres "stores" guardados en la direccion: `frontend/src/stores`:
- `useAuthStore`: manejo de autenticacion y de la sesion de un usuario. Los estados dentro de la interfas `AuthState` fueron `user: UserData | null` y `token: String | null`
- `useHackatonStore`: gestion del estado de la competencia. El estado utilizado dentro de la interfaz `HackatonState` fue `hackaton: Hackaton[]`
- `useSubmissionStore`: administra participaciones en las competencias. El estado dentro de la interfaz `SubmissionState` fue `submission: Submission[]`

## Mapa de Rutas y Flujo de Autenticacion

// Todo: diagrama
### Rutas Creadas
El proyecto hizo uso de las siguientes rutas:
- `/`: ruta principal.
- `/login`: ruta para realizar el "login" con una cuenta.
- `/signup`: ruta para crear una cuenta.
- `/profile`: ruta para ver el perfil de una cuenta.
- `/create-hackathon`: ruta para crear una competencia.
- `/hackaton/:id/`, junto a `/hackaton/:id/results`, `/hackaton/:id/submit`, `/hackaton/:id/submission/:submissionId` con `/:id` el "id" de una competencia subida: rutas de una competencia para ver los resultados, subir a una competencia, ver uno de los desarrollos subidos en una competencia en base a su "id" (submissionId).

### Endpoints

### Flujo de Autenticacion


## Descripcion de los Tests E2E
### Herramientas usadas
### Flujos Cubiertos

<!--
Usamos playwright
//#figure(
//  image("images/landing0.png", height:7cm),
//  caption: [Pantalla principal]
//)
-->
## Librerias de Estilos y Decisiones de Diseño
### Librerias de Estilo
Usamos Shadcn + tailwindCSS desde el hito 1, del registro de shadcn usamos algunos componentes de magicUI, mientras que para el resto usamos el registro predeterminado por @shadcn y alteramos los estilos a nuestro gusto.

### Decisiones de Diseño
// Todo: explicar diseño (base shadcn + landing bonita con paleta de colores X y z)

## Deploy
URL: https://fullstack.dcc.uchile.cl:7137/

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

## Arbol del Proyecto:

```
├── backend
│   ├── dist
│   │   └── crown.svg
│   ├── docker-compose.yml
│   ├── package-lock.json
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── src
│   │   ├── app.ts
│   │   ├── controllers
│   │   │   ├── hackatons.ts
│   │   │   ├── login.ts
│   │   │   ├── submissions.ts
│   │   │   └── users.ts
│   │   ├── index.ts
│   │   ├── models
│   │   │   ├── hackaton.ts
│   │   │   ├── submission.ts
│   │   │   └── user.ts
│   │   └── utils
│   │       ├── config.ts
│   │       ├── logger.ts
│   │       └── middleware.ts
│   └── tsconfig.json
├── e2etests
│   ├── package-lock.json
│   ├── package.json
│   ├── playwright.config.ts
│   ├── pnpm-lock.yaml
│   └── tests
│       ├── dbHelpers.ts
│       ├── example.spec.ts
│       ├── hackaton.spec.ts
│       ├── helper.ts
│       ├── login.spec.ts
│       ├── submission.spec.ts
│       └── voting.spec.ts
├── frontend
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── public
│   │   └── crown.svg
│   ├── README.md
│   ├── src
│   │   ├── App.tsx
│   │   ├── components
│   │   │   ├── HackatonCards.tsx
│   │   │   ├── HackatonForm.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── login-form.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── signup-form.tsx
│   │   │   ├── SubmissionCards.tsx
│   │   │   └── ui
│   │   │       ├── alert-dialog.tsx
│   │   │       ├── avatar.tsx
│   │   │       ├── button.tsx
│   │   │       ├── calendar.tsx
│   │   │       ├── card-hover-effect.tsx
│   │   │       ├── card.tsx
│   │   │       ├── date-picker.tsx
│   │   │       ├── hero-highlight.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── navigation-menu.tsx
│   │   │       ├── popover.tsx
│   │   │       ├── sonner.tsx
│   │   │       └── textarea.tsx
│   │   ├── hooks
│   │   │   └── useField.ts
│   │   ├── lib
│   │   │   └── utils.ts
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── CreateHackathonPage.tsx
│   │   │   ├── HackathonResults.tsx
│   │   │   ├── LandingPage
│   │   │   │   ├── AboutSection.tsx
│   │   │   │   ├── CreateHackatonSection.tsx
│   │   │   │   ├── FeatureCard.tsx
│   │   │   │   └── LandingPage.tsx
│   │   │   ├── ListSubmissions.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── SubmissionDetails.tsx
│   │   │   └── SubmitComponent.tsx
│   │   ├── services
│   │   │   ├── hackatons.ts
│   │   │   ├── login.ts
│   │   │   └── submissions.ts
│   │   ├── stores
│   │   │   ├── authStore.ts
│   │   │   ├── hackatonStore.ts
│   │   │   └── submissionStore.ts
│   │   ├── styles
│   │   │   └── style.css
│   │   ├── types
│   │   │   └── types.ts
│   │   ├── utils
│   │   │   └── axiosSecure.ts
│   │   └── vite-env.d.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── README.md
```
---

## Aclaraciones y Palabras Finales

En el desarrollo del proyecto nos dimos cuenta que la librería de react-live no es totalmente segura, y que el uso de sandboxes de código para evitar vulnerabilidades es un tema bien complicado de implementar. En primer lugar tratamos de migrar a la librería sandpack, pero la refactorización tomaba mucho esfuerzo y código, por lo que sanitizamos el input del usuario intentando que no se suba código malicioso. En el hipotético caso de un proyecto real deberíamos aplicar alguna medida segura para evitar ejecución de código js a los usuarios, ya sea aplicando todas las medidas que integra sandpack o aplicando un sistema de revisión y moderación.



