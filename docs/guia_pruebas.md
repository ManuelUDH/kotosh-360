# Guía de Pruebas y Ejecución — Kotosh 360 🏛️

Esta guía detalla los pasos para instalar, configurar y ejecutar de forma local los distintos módulos del proyecto **Kotosh 360** (Backend y Dashboard). 

---

## 🚀 Inicio Rápido (Servicios)

El proyecto consta de dos partes principales de software web: el **Backend** (API REST en Express) y el **Dashboard** (React App). A continuación se describe cómo ejecutar cada uno.

### 1. Backend (API REST)
El backend está configurado en `src-backend/`. Se encarga de gestionar los Hotspots AR, las métricas e interacciones de usuarios en el Complejo Arqueológico de Kotosh.

> **Nota:** Hemos mejorado el archivo `src-backend/config/database.js` para que, en caso de no tener una base de datos MongoDB ejecutándose localmente, el backend **no se detenga ni crasheé**. Mostrará una advertencia clara en la consola y la API seguirá activa respondiendo con mock-data o endpoints estáticos.

**Pasos para iniciarlo:**
1. Abre una terminal de PowerShell o CMD en la raíz del proyecto.
2. Ingresa a la carpeta del backend:
   ```bash
   cd src-backend
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm start
   ```
   *El servidor de la API correrá en el puerto `5000` (http://localhost:5000).*

#### Sembrado Inicial de Datos (Seed Database)
Una vez iniciado el backend, si tienes MongoDB corriendo, puedes inicializar la base de datos con los Hotspots por defecto del Templo de Kotosh (Manos Cruzadas, Altar Central, Muro Norte, Entrada Principal) realizando una petición GET al endpoint de sembrado:
```
http://localhost:5000/api/hotspots/seed
```
Esto creará de forma automática los registros de prueba en tu base de datos local.

---

### 2. Dashboard Analítico (React)
El panel de visualización turística y métricas se encuentra en `src-dashboard/`. 

**Pasos para iniciarlo:**
1. Abre una terminal en la raíz del proyecto.
2. Ingresa a la carpeta del dashboard:
   ```bash
   cd src-dashboard
   ```
3. Ejecuta la aplicación React:
   ```bash
   npm start
   ```
   *Esto compilará y abrirá de forma automática la interfaz en tu navegador en http://localhost:3000.*

---

## 📱 App de Realidad Aumentada (Unity C#)
La aplicación móvil de Realidad Aumentada se encuentra en `src-mobile-app/`. Para probar y compilar esta aplicación:
1. Asegúrate de tener instalado **Unity Hub** y la versión de Unity especificada para el proyecto.
2. Abre la carpeta `src-mobile-app/` como un proyecto existente en Unity.
3. Configura el target build para **Android** o **iOS** según corresponda.
4. Para realizar peticiones a la API del backend en producción, actualiza la dirección URL base de la API en el script de conexión de Unity, apuntándola a la IP de tu servidor local o el dominio desplegado en la nube.
