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
El presente repositorio cuenta con el proyecto realizado para el curso "Aplicaciones Web Reactivas" durante el semestre de primavera de 2025. Esta entrega corresponde al 3er (y último) hito del proyecto previo a la presentación final, donde se hace uso de todas las herramientas integradas durante el semestre para la realización de una aplicación web. Es importante mencionar que, comparado a otras ocasiones donde se realizaba la entrega de un informe con respecto al hito del proyecto, el `README` del repositorio corresponde al informe para esta entrega, siguiendo las instrucciones del cuerpo docente.

El proyecto está alojado en el siguiente [repositorio público de GitHub](https://github.com/fgonzalezurriola/react-royale). Los desarrollos correspondientes a este hito se encuentran en la rama `hito3`.

## Tema del proyecto
"React Royale" es una plataforma web fullstack para organizar competencias de componentes de React. La aplicación permite crear competencias con un tiempo límite y bajo cierta temática para que los usuarios puedan participar.

Los participantes pueden subir sus componentes para participar en una competencia (o hackatón) durante un tiempo determinado por la persona que creó la competencia. Al terminar el tiempo de participación, comienza el periodo de votación, en donde los usuarios pueden votar por su componente favorito (solo uno). Al terminar el tiempo de votación, se muestran los componentes en orden de más votado y se cierra la competencia.

## Estructura del Estado Global
Para la realización de la aplicación, se utilizó Zustand para el manejo de estados, lo que permitió eliminar tres *hooks* y el *React Context* que usaba `Auth`.

### Stores
Se crearon tres "stores" guardados en la dirección: `frontend/src/stores`:
- `useAuthStore`: manejo de autenticación y de la sesión de un usuario. Los estados dentro de la interfaz `AuthState` fueron `user: UserData | null` y `token: string | null`.
- `useHackatonStore`: gestión del estado de la competencia. El estado utilizado dentro de la interfaz `HackatonState` fue `hackaton: Hackaton[]`.
- `useSubmissionStore`: administra las participaciones en las competencias. El estado dentro de la interfaz `SubmissionState` fue `submission: Submission[]`.

## Mapa de Rutas y Flujo de Autenticacion
### Rutas Creadas
El proyecto hizo uso de las siguientes rutas:
- `/`: ruta principal.
- `/login`: ruta para realizar el "login" con una cuenta.
- `/signup`: ruta para crear una cuenta.
- `/profile`: ruta para ver el perfil de una cuenta.
- `/create-hackathon`: ruta para crear una competencia.
- `/hackaton/:id/`, junto a `/hackaton/:id/results`, `/hackaton/:id/submit`, `/hackaton/:id/submission/:submissionId` con `/:id` el "id" de una competencia subida: rutas de una competencia para ver los resultados, subir a una competencia, ver uno de los desarrollos subidos en una competencia en base a su "id" (submissionId).

### Endpoints
Se tienen los siguientes endpoints que se ubicaron en los archivos dentro del directorio `backend/src/controllers`:

#### `hackatons.ts`
Respecto a la manipulación de las competiciones:
1. Metodo: GET; Ruta: `/`; Uso esperado: Obtener todas las competiciones de la base de datos.
2. Metodo: GET; Ruta: `/:id`; Uso esperado: Obtener una competición específica por su ID en la base de datos.
3. Metodo: POST; Ruta: `/`; Uso esperado: Crear una nueva competición (requiere autenticación).
4. Metodo: DELETE; Ruta: `/:id`; Uso esperado: Eliminar una competición (requiere autenticación y ser host).
5. Metodo: PUT; Ruta: `/:id`; Uso esperado: Actualizar una competición existente dado su "id" (requiere autenticación y que sea el host).

#### `login.ts`
Respecto a la autenticación de un usuario:
1. Metodo: POST; Ruta: `/` ; Uso esperado: autenticar usuario con username y password.
2. Metodo: GET; Ruta: `/me` ; Uso esperado: obtener información del usuario autenticado actualmente.
3. Metodo: POST; Ruta: `/logout` ; Uso esperado: cerrar sesión eliminando la cookie del token.

#### `submission.ts`
Respecto a la manipulación de los submissions, es decir, el manejo de subir soluciones a una competencia:
1. Metodo: GET; Ruta: `/` ; Uso esperado: obtener todas las submissions (filtrable por hackatonId).
2. Metodo: GET; Ruta: `/:id`; Uso esperado: obtener una submission específica por ID, incluye campo hasVoted.
3. Metodo: POST; Ruta: `/` ; Uso esperado: crear una nueva submission (requiere autenticación).
4. Metodo: PUT; Ruta: `/:id` ; Uso esperado: actualizar una submission existente (requiere autenticacióny ser el usuairo que subio el submission).
5. Metodo: POST; Ruta: `/:id/vote`; Uso esperado: votar por una submission durante el período de votación (requiere autenticación, un voto por competición y se permite cambiar voto)
6. Metodo: DELETE; Ruta: `/:id` ; Uso esperado: eliminar una submission (requiere autenticación y ser el autor)

#### `users.ts`
Respecto a la manipulación de un usuario:
1. Metodo: GET; Ruta: `/:id` ; Uso esperado: obtener un usuario específico por ID.
2. Metodo: GET; Ruta: `/` ; Uso esperado: obtener los usuarios de la base de datos.
3. Metodo: POST; Ruta: `/` ; Uso esperado: crear un nuevo usuario con username, name y password.
4. Metodo: DELETE; Ruta: `/:id` ; Uso esperado: eliminar un usuario (requiere autenticación y ser el dueño/ser el usuario).
5. Metodo: PUT; Ruta: `/:id` ; Uso esperado: Actualizar username y name de un usuario (requiere autenticación y ser el usuario).

### Flujo de Autenticacion
1. Inicio de sesión: el usuario envía sus credenciales al servidor mediante una petición HTTP POST.

2. Validación: el servidor verifica el hash de la contraseña contra el almacenado en la base de datos.

3. Generación de tokens: una vez validadas las credenciales, el servidor genera un JWT que incluye un token CSRF  con validez de 1 hora .

4. Almacenamiento seguro: el servidor envía el JWT al cliente mediante una cookie con las flags `httpOnly` y `secure`, impidiendo el acceso desde JavaScript y protegiéndolo contra ataques XSS.

5. Autenticación de peticiones: el navegador envía automáticamente la cookie en cada petición subsecuente a recursos protegidos. El frontend almacena el token CSRF en `localStorage` y lo incluye en el header `X-CSRF-Token` de peticiones autenticadas.

6. Protección CSRF: las peticiones POST incluyen un header con el token CSRF extraído del JWT. El servidor valida mediante el middleware `withUser` que el token CSRF del header coincida con el embebido en el JWT, previniendo ataques de tipo Cross-Site Request Forgery.

7. Restauración de sesión: al cargar la aplicación, se realiza una petición GET a `/api/login/me` que incluye automáticamente la cookie HTTP-only. El servidor verifica el JWT, extrae el `userId` y retorna los datos del usuario, restaurando el estado de autenticación sin necesidad de login manual.

8. Cierre de sesión: el usuario ejecuta logout mediante POST a `/api/login/logout`. El servidor limpia la cookie con `response.clearCookie('token')` y el frontend elimina el token CSRF de `localStorage` y limpia el estado de Zustand.RetryClaude can make mistakes. Please double-check responses.

## Descripción de los Tests E2E

### Herramientas usadas
Para la realización de los tests E2E, la principal herramienta utilizada fue **Playwright**, cuya configuración se encuentra ubicada en el archivo `playwright.config.ts`.

### Flujos cubiertos
Los tests realizados se incorporaron en archivos en la ubicación `e2etests/tests`. De esta forma, el proyecto hizo uso de los siguientes archivos:

#### `login.spec.ts`
Realiza tests con respecto al inicio de sesión (login):
- Entrar con credenciales válidas.
- Entrar con credenciales inválidas.
- Redirección de rutas protegidas cuando no se está autenticado.
- Permitir acceso a rutas protegidas si se está autenticado.
- Cierre de sesión (logout).

#### `hackaton.spec.ts`
Realiza tests con respecto a las competencias:
- Testear la creación de competencias con fecha actual de inicio.
- Listar las competencias creadas.
- Navegar por cada competencia.
- No permitir crear competencias si no se está autenticado.

#### `submission.spec.ts`
Realiza tests con respecto a subir soluciones a una competencia activa:
- Probar la creación de una solución para una competencia activa.
- Listar las soluciones subidas en una competencia activa.
- Mostrar estado vacío (es decir, que no hay soluciones) cuando no se ha subido ninguna solución a una competencia.

#### `voting.spec.ts`
Realiza pruebas con respecto a las votaciones:
- Probar que un usuario pueda votar en una solución existente para una competencia.
- Probar que un usuario puede cambiar su voto en caso de que existan varias soluciones.

### Ejecutar Tests
Para poder ejecutar los tests E2E, primero debe inicializarse el backend del proyecto. Una vez inicializado, se inicializa el frontend. Finalmente, para ejecutar los tests debemos dirigirnos al directorio `e2etests/` y ejecutar:
```bash
npm i
npm test
```
De esta forma se instalaran los paquetes necesarios y se ejecutaran los tests.


## Librerias de Estilos y Decisiones de Diseño
### Librerias de Estilo
Usamos Shadcn + tailwindCSS desde el hito 1, del registro de shadcn usamos algunos componentes de magicUI, mientras que para el resto usamos el registro predeterminado por @shadcn y alteramos los estilos a nuestro gusto.

### Decisiones de Diseño
Dependiendo de las vistas se tomaron distintas decisiones de diseño:
- Vista de entrada: agregar inicio de sesión y creación de cuenta, además de listar las competencias en proceso y aquellas finalizadas.
- Detalles de competición: listar los componentes que han sido subidos para la competencia, además de la opción para ver la votación y participar.
- Detalle de participación de una competición: mostrar el componente subido y el *preview* de este en su costado, además de la opción para votar.
- Participación: formulario que muestra un editor y un *preview* de lo que se va a subir. Sobre esto se incluye el cuadro para poner el título y agregar una descripción.
- Detalle de votación: muestra los tres más votados para un acceso más cómodo, junto con su *preview*, título y descripción. Debajo del tercer lugar se encuentra un listado ordenado de más votado a menos votado, incluyendo todos los participantes que subieron componentes.


## Deploy
URL: https://fullstack.dcc.uchile.cl:7137/

```sh
# Construir backend
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

En el desarrollo del proyecto nos dimos cuenta de que la librería react-live no es totalmente segura, y que el uso de sandboxes de código para evitar vulnerabilidades es un tema bastante complicado de implementar. En primer lugar, tratamos de migrar a la librería sandpack, pero la refactorización requería demasiado esfuerzo y cambios en el código, por lo que optamos por sanitizar el input del usuario para evitar que se suba código malicioso. En el hipotético caso de un proyecto real, deberíamos aplicar alguna medida segura para evitar la ejecución de código JavaScript por parte de los usuarios, ya sea utilizando todas las medidas de seguridad que integra sandpack o implementando un sistema de revisión y moderación.
