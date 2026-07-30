# AyudaZ Frontend

Frontend desarrollado con React para la plataforma AyudaZ.

Permite a los usuarios registrarse, iniciar sesión, gestionar solicitudes de ayuda y acceder al panel administrativo según su rol.

---

## Tecnologías

- React
- JavaScript
- Vite
- Axios
- React Router
- Firebase Authentication
- Tailwind CSS
- Bootstrap

---

## Características

### Usuarios

- Registro
- Inicio de sesión
- Recuperación de sesión
- Perfil

### Beneficiarios

- Crear solicitudes
- Consultar estado
- Actualizar información

### Administrador

- Dashboard
- Gestión de usuarios
- Gestión de solicitudes
- Logs administrativos
- Estadísticas

---

## Estructura

```
src
│
├── components
├── pages
├── services
├── hooks
├── context
├── layouts
├── assets
└── routes
```

---

## Instalación

Clonar proyecto

```bash
git clone https://github.com/usuario/ayudaz-frontend.git
```

Instalar dependencias

```bash
npm install
```

Variables de entorno

```
VITE_API_URL=

VITE_FIREBASE_API_KEY=

VITE_FIREBASE_AUTH_DOMAIN=

VITE_FIREBASE_PROJECT_ID=

VITE_FIREBASE_STORAGE_BUCKET=

VITE_FIREBASE_MESSAGING_SENDER_ID=

VITE_FIREBASE_APP_ID=
```

Ejecutar

```bash
npm run dev
```

---

## Funcionalidades

- Autenticación
- Protección de rutas
- Panel administrativo
- CRUD de usuarios
- Gestión de solicitudes
- Consumo de API REST
- Validación de formularios
- Responsive Design

---

## Comunicación con Backend

La aplicación consume una API REST desarrollada con Spring Boot utilizando Axios.

Ejemplo

```javascript
GET /usuarios

POST /auth/login

PUT /usuarios/{id}

DELETE /usuarios/{id}
```

---

## Autenticación

La autenticación utiliza:

- Firebase Authentication
- JWT
- Axios Interceptors

---

## Responsive

La interfaz fue desarrollada para dispositivos:

- Desktop
- Tablet
- Mobile

---

## Despliegue

Frontend desplegado mediante Netlify.

---

## Autor

Helson Palomino

Estudiante de Ingeniería de Software
