# Seguridad en Login - NestJS & Angular

Este proyecto es un esqueleto robusto y seguro para aplicaciones web modernas, utilizando **NestJS** en el backend y **Angular** en el frontend. Está diseñado con un enfoque principal en la seguridad, la auditoría de peticiones y las mejores prácticas de desarrollo.

## 🚀 Características Principales

### Backend (NestJS)
- **Autenticación JWT**: Implementación segura con Passport.js y Guards personalizados.
- **Seguridad Global**:
  - **Helmet**: Cabeceras de seguridad HTTP configuradas.
  - **CORS**: Configuración restrictiva para el intercambio de recursos.
  - **Rate Limiting**: Protección contra ataques de fuerza bruta y DoS mediante `@nestjs/throttler`.
- **Auditoría Automática**: Un `LoggingInterceptor` global registra cada interacción del usuario (método, endpoint, IP, ID de usuario) en una tabla de auditoría.
- **Validación**: Todos los datos de entrada son validados y saneados automáticamente con `class-validator` y `class-transformer`.
- **Gestión de Archivos**: Sistema de subida de imágenes de perfil con validación de tipos y almacenamiento organizado.
- **Base de Datos**: TypeORM con soporte para SQLite (fácil de migrar a PostgreSQL/MySQL).

### Frontend (Angular)
- **Standalone Components**: Arquitectura moderna sin módulos innecesarios.
- **Angular Material**: Interfaz de usuario premium, limpia y responsiva.
- **Gestión de Estado**: Uso de **Signals** para un manejo reactivo y eficiente de la autenticación y datos de usuario.
- **Seguridad**:
  - Interceptores HTTP para adjuntar automáticamente el token JWT.
  - Guards de ruta para proteger áreas privadas.
- **SEO & UX**: Servicio dedicado para la gestión dinámica de títulos y meta-etiquetas, y optimización de carga con Lazy Loading.

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
| :--- | :--- |
| **Backend** | NestJS, TypeORM, Passport JWT, SQLite, Multer |
| **Frontend** | Angular 17+, Angular Material, RxJS, Signals |
| **Seguridad** | Helmet, Throttler, Bcrypt (Hasheo de contraseñas) |
| **Estilos** | CSS Moderno, Flexbox/Grid |

## 📦 Estructura del Proyecto

```text
seguridad_en_login/
├── nestjs/              # Servidor Backend
│   ├── src/
│   │   ├── common/      # Guards, Interceptors, Decorators, Entities compartidas
│   │   └── modules/     # Módulos: Auth, Users
│   └── database.sqlite  # Base de datos local
├── angular/             # Aplicación Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/    # Servicios, Guards, Interceptors, Models
│   │   │   ├── features/# Módulos de negocio (Auth, Users)
│   │   │   └── shared/  # UI, Pipes, Componentes comunes
└── README.md
```

## 🛠️ Instalación y Configuración

### Requisitos Previos
- Node.js (v18+)
- npm

### 1. Clonar y Configurar el Backend
```bash
cd nestjs
npm install
npm run start:dev
```
*El servidor correrá en `http://localhost:3000/api/v1`*

### 2. Configurar el Frontend
```bash
cd angular
npm install
npm start
```
*La aplicación será accesible en `http://localhost:4200`*

## 🛡️ Sistema de Auditoría e Invocación
Una característica clave es que cada petición realizada por un usuario autenticado se contabiliza. En la vista de **Detalle de Usuario**, se puede visualizar el número total de "Invocaciones de Request" registradas, permitiendo un monitoreo preciso de la actividad del sistema.

## 📄 Licencia
Este proyecto es una plantilla de código abierto para fines educativos y de inicio de proyectos seguros.
