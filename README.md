# Gestor de Gimnasio - Aplicación Web 🚀

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

Una aplicación web moderna y simple para la gestión de miembros de un gimnasio. Permite llevar un control de ingresos, registrar nuevos miembros, gestionar membresías y visualizar estadísticas clave del negocio. Desarrollada con un stack tecnológico rápido y escalable.

---

## 📋 Tabla de Contenidos

1.  [📸 Vistas Previa](#-vistas-previa)
2.  [✨ Características Principales](#-características-principales)
3.  [🛠️ Tecnologías Utilizadas](#-tecnologías-utilizadas)
4.  [🚀 Cómo Empezar (Instalación Local)](#-cómo-empezar-instalación-local)
5.  [📄 Licencia](#-licencia)

---

## 📸 Vistas Previa

Aquí tienes un vistazo de cómo luce la aplicación.

**Pantalla de Ingreso (Check-in)**
*Simple y optimizada para tablets en la entrada del gimnasio.*
(https://imgur.com/QSUSwZv)

**Panel de Administración**
*El centro de control con estadísticas, gráficos y la lista de miembros.*
(https://imgur.com/eISvh88)

**Gestión de Miembros**
*Modal para registrar nuevos socios de forma rápida y sencilla.*
(https://imgur.com/jp6uxIn)

---

## ✨ Características Principales

### Página de Ingreso (Pública)
-   **Check-in por DNI:** Los miembros registran su asistencia ingresando su número de DNI.
-   **Validación de Membresía:** El sistema verifica en tiempo real si la membresía está activa o vencida.
-   **Feedback Instantáneo:** Muestra mensajes de bienvenida o de error claros y concisos.
-   **Registro de Asistencia:** Cada ingreso exitoso se guarda en la base de datos para generar estadísticas.

### Panel de Administración (Privado y Seguro)
-   **🔐 Autenticación Segura:** Acceso protegido por email y contraseña a través de Supabase Auth.
-   **📊 Dashboard de Estadísticas:**
    -   Tarjetas con un resumen de ingresos del día, semana y mes.
    -   Contador de miembros activos.
    -   Gráfico de barras que muestra las horas de mayor afluencia en los últimos 30 días.
-   **👥 Gestión Completa de Miembros (CRUD):**
    -   **Visualizar:** Tabla con todos los miembros, sus datos de contacto, fecha de vencimiento y estado (Activo/Vencido).
    -   **Registrar:** Formulario en un modal para añadir nuevos miembros, permitiendo seleccionar la duración inicial de su membresía.
    -   **Renovar:** Botón para extender la membresía de un socio por 30 días con un solo clic.
    -   **Eliminar:** Opción para borrar miembros de la base de datos (con diálogo de confirmación).

---

## 🛠️ Tecnologías Utilizadas

<table>
  <tr>
    <td align="center"><img src="https://vitejs.dev/logo.svg" width="40" alt="Vite Logo"><br><sub><b>Vite</b></sub></td>
    <td align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="40" alt="React Logo"><br><sub><b>React</b></sub></td>
    <td align="center"><img src="https://raw.githubusercontent.com/tailwindlabs/tailwindcss/master/src/css/logos/mark.svg" width="40" alt="Tailwind CSS Logo"><br><sub><b>Tailwind CSS</b></sub></td>
    <td align="center"><img src="https://supabase.com/_next/image?url=%2Fimages%2Flogo-wordmark--dark.png&w=256&q=75" width="100" alt="Supabase Logo"><br><sub><b>Supabase</b></sub></td>
  </tr>
</table>

-   **Frontend:** React + Vite
-   **Estilos:** Tailwind CSS
-   **Backend y Base de Datos:** Supabase (PostgreSQL, Auth, Realtime)
-   **Enrutamiento:** React Router DOM
-   **Gráficos:** Recharts

---

## 🚀 Cómo Empezar (Instalación Local)

Sigue estos pasos para levantar el proyecto en tu máquina local.

### Prerrequisitos
-   Node.js (versión 18 o superior)
-   npm o yarn

### 1. Clonar el Repositorio
```bash
git clone [https://github.com/TU_USUARIO/NOMBRE_DE_TU_REPO.git](https://github.com/TU_USUARIO/NOMBRE_DE_TU_REPO.git)
cd NOMBRE_DE_TU_REPO
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Supabase
1.  Crea un nuevo proyecto en [supabase.com](https://supabase.com).
2.  Ve a la sección **SQL Editor** y haz clic en **"New query"**.
3.  Copia y pega el siguiente código SQL para crear las tablas `miembros` e `ingresos` con su estructura correcta.
    ```sql
    -- Crear la tabla de miembros
    CREATE TABLE public.miembros (
      id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      nombre text NULL,
      apellido text NULL,
      dni text NULL,
      celular text NULL,
      fecha_vencimiento date NULL,
      CONSTRAINT miembros_pkey PRIMARY KEY (id),
      CONSTRAINT miembros_dni_key UNIQUE (dni)
    );
    
    -- Crear la tabla de ingresos
    CREATE TABLE public.ingresos (
      id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      miembro_id bigint NULL,
      CONSTRAINT ingresos_pkey PRIMARY KEY (id),
      CONSTRAINT ingresos_miembro_id_fkey FOREIGN KEY (miembro_id) REFERENCES public.miembros (id) ON DELETE CASCADE
    );

    -- Desactivar Row Level Security (RLS) para desarrollo fácil
    -- ¡Recuerda activarlo para producción!
    ALTER TABLE public.miembros DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.ingresos DISABLE ROW LEVEL SECURITY;
    ```
4.  Haz clic en **"RUN"** para ejecutar el script y crear las tablas.
5.  Ve a **Project Settings > API** para obtener tu **URL del Proyecto** y tu **`anon` `public` key**.

### 4. Configurar Variables de Entorno
1.  En la raíz de tu proyecto, crea un archivo llamado `.env.local`.
2.  Añade tus claves de Supabase al archivo de la siguiente manera:
    ```
    VITE_SUPABASE_URL="URL_DE_TU_PROYECTO_SUPABASE"
    VITE_SUPABASE_ANON_KEY="TU_ANON_KEY_PUBLICA"
    ```
3.  **Importante:** Asegúrate de que tu archivo `supabaseClient.js` esté usando estas variables:
    ```javascript
    // src/lib/supabaseClient.js
    import { createClient } from '@supabase/supabase-js'

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    export const supabase = createClient(supabaseUrl, supabaseAnonKey)
    ```
4.  Añade `.env.local` a tu archivo `.gitignore` para no subir tus claves secretas a GitHub.

### 5. Iniciar la Aplicación
```bash
npm run dev
```
La aplicación estará corriendo en `http://localhost:5173`.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---
_Desarrollado con ❤️ por AlexisBogarin
