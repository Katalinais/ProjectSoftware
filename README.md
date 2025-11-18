# Sistema de Gestión de Procesos Legales

Sistema web para la gestión integral de procesos judiciales, personas, actuaciones y estadísticas del juzgado.

## 🚀 Características

- **Gestión de Procesos**: Crear, editar y gestionar procesos legales con diferentes tipos (Ordinario, Ejecutivo, Tutela, etc.)
- **Gestión de Personas**: Administrar demandantes y demandados con diferentes tipos de documento
- **Actuaciones**: Registrar y gestionar actuaciones judiciales (Autos y Sentencias)
- **Descripciones**: Administrar descripciones de actuaciones por tipo de proceso
- **Estadísticas y Reportes**: Generar reportes Excel con matrices de categorías y estadísticas detalladas
- **Vista Previa**: Visualizar matrices de datos antes de descargar reportes
- **Interfaz Responsive**: Diseño adaptativo para desktop y móvil

## 🛠️ Tecnologías

### Backend
- **Node.js** con **Express.js**
- **Prisma ORM** para gestión de base de datos
- **PostgreSQL** como base de datos
- **JWT** para autenticación
- **ExcelJS** para generación de reportes

### Frontend
- **Next.js 16** con **React 19**
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Radix UI** para componentes accesibles
- **React Hook Form** para formularios

## 📋 Requisitos Previos (Desarrollo Local)

- Node.js 18+ 
- Docker y Docker Compose
- npm o pnpm

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd juzgado-app
```

### 2. Configurar Base de Datos

Iniciar PostgreSQL con Docker Compose:

```bash
docker-compose up -d
```

### 3. Configurar Backend

```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos

# Ejecutar migraciones
npm run prisma:generate
npm run prisma:migrate

# (Opcional) Poblar base de datos con datos de prueba
npm run seed
```

### 4. Configurar Frontend

```bash
cd ../frontend
npm install
```

## 🚀 Ejecución

### Desarrollo

**Backend** (puerto 4000):
```bash
cd backend
npm run dev
```

**Frontend** (puerto 3000):
```bash
cd frontend
npm run dev
```

### Producción

**Backend**:
```bash
cd backend
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
npm start
```

## 🌐 Despliegue

La aplicación está desplegada en producción de la siguiente manera:

- **Frontend**: [Vercel](https://vercel.com) (Next.js)
- **Backend**: [Vercel](https://vercel.com) / [Railway](https://railway.app)
- **Base de datos**: [Supabase](https://supabase.com) PostgreSQL

### Configuración de Producción

Para el despliegue en producción, asegúrate de configurar las siguientes variables de entorno:

**Backend:**
- `DATABASE_URL`: URL de conexión a Supabase PostgreSQL
- `JWT_SECRET`: Clave secreta para JWT (generar una clave segura)
- `PORT`: Puerto del servidor (generalmente asignado automáticamente por la plataforma)

**Frontend:**
- Configurar la URL del backend en las peticiones API

## 📁 Estructura del Proyecto

```
juzgado-app/
├── backend/
│   ├── controllers/     # Controladores de rutas
│   ├── services/        # Lógica de negocio
│   ├── repositories/    # Acceso a base de datos
│   ├── routes/         # Definición de rutas
│   ├── middlewares/    # Middlewares (auth, etc.)
│   ├── models/         # Modelos de datos
│   ├── prisma/         # Schema y migraciones
│   ├── utils/          # Utilidades (generador Excel)
│   └── mocks/          # Datos de prueba
├── frontend/
│   ├── app/            # Páginas Next.js
│   ├── components/     # Componentes React
│   │   ├── modules/    # Módulos principales
│   │   └── ui/         # Componentes UI reutilizables
│   ├── contexts/       # Contextos React
│   └── lib/            # Utilidades
└── docker-compose.yml  # Configuración Docker
```

## 🔐 Autenticación

El sistema utiliza JWT para autenticación. Las rutas protegidas requieren un token válido en el header:

```
Authorization: Bearer <token>
```

## 📊 Reportes Excel

El sistema genera reportes Excel con las siguientes hojas:

1. **Matriz Categorías**: Matriz de categorías de procesos Ordinario/Ejecutivo
2. **Matriz Tutela**: Matriz de categorías de Tutela
3. **Resumen General**: Estadísticas generales
4. **Procesos por Tipo**: Conteo de procesos por tipo
5. **Personas por Tipo**: Conteo de personas por tipo de documento
6. **Actuaciones por Tipo**: Conteo de actuaciones por tipo
7. **Detalle de Procesos**: Listado detallado de procesos

## 🧪 Datos de Prueba

Para poblar la base de datos con datos de prueba:

```bash
cd backend
npm run seed
```

Esto generará:
- Personas (demandantes y demandados)
- Procesos de diferentes tipos
- Actuaciones asociadas a los procesos

### Frontend

No requiere variables de entorno adicionales. El backend debe estar en `http://localhost:4000`.

## 🤝 Contribuir

1. Crear una rama para la nueva funcionalidad
2. Realizar los cambios
3. Crear un Pull Request con descripción detallada

## 📄 Licencia

Este proyecto es privado y de uso interno.

## 👥 Soporte

Para soporte o consultas, contactar al equipo de desarrollo.

