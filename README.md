### 📄 `README.md`

```markdown
# 🛍️ Product Checkout App - Frontend

Este proyecto representa el frontend de una aplicación de ecommerce de una sola página (SPA) que permite realizar pagos mediante la plataforma Wompi. El flujo guía al usuario desde la selección de un producto, ingreso de datos de pago y envío, hasta la confirmación del estado de la transacción.

---

## ⚙️ Arquitectura

Este frontend está desarrollado con:

- **React 19 + TypeScript**
- **Arquitectura Hexagonal**
- **Redux Toolkit** para manejo de estado
- **React Router v7** para navegación entre pasos
- **TailwindCSS** para estilos
- **Jest + React Testing Library** para pruebas

Estructura hexagonal de carpetas:

```

product-checkout-app/
├── src/
│ ├── application/ # Casos de uso y lógica de negocio (ej: fetchProducts)
│ ├── domain/ # Entidades puras del dominio (ej: Product)
│ ├── infrastructure/ # Comunicación externa (ej: API de Wompi)
│ │ └── api/
│ ├── ui/ # Componentes y páginas de la interfaz
│ │ ├── components/ # Componentes reutilizables (Input, Button, StepIndicator)
│ │ └── pages/ # Páginas principales (ProductPage, CheckoutPage, etc.)
│ ├── store/ # Redux Toolkit y slices (product, transaction)
│ ├── routes/ # Definición de rutas y navegación
│ ├── shared/ # Tipos globales y utilidades compartidas
│ └── main.tsx # Punto de entrada principal
├── public/ # Archivos estáticos
├── index.html
└── README.md

````

---

## 🚀 Ejecutar localmente

```bash
git clone https://github.com/tu-usuario/product-checkout-app.git
cd product-checkout-app
npm install
npm run dev
````

* Asegúrate de tener un archivo `.env` con:

  ```env
  VITE_WOMPI_PUBLIC_KEY=pub_stagtest_xxxxxx
  ```

---

## 🔧 Ejecutar en producción

### Opción recomendada: **Vercel**

1. Subir el frontend a GitHub
2. Crear proyecto en [https://vercel.com](https://vercel.com)
3. Configurar:

   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
   * **Variable de entorno:** `VITE_WOMPI_PUBLIC_KEY`

### Alternativa: AWS S3

```bash
npm run build
# Sube dist/ como sitio estático en tu bucket S3
```

---

## 🌐 Variables de entorno

| Variable                | Descripción                                                     |
| ----------------------- | --------------------------------------------------------------- |
| `VITE_WOMPI_PUBLIC_KEY` | Llave pública proporcionada por Wompi para sandbox o producción |

---

## 🔄 Estado persistente

El estado de Redux (producto seleccionado, transacción, etc.) se sincroniza con `localStorage`, permitiendo persistencia entre refrescos de página.

```ts
store.subscribe(() => {
  localStorage.setItem('store', JSON.stringify(store.getState()))
})
```

---

## 🔌 Endpoints backend importantes

* `POST /transaction`: Crear transacción con datos de tarjeta
* `GET /transaction/:id`: Obtener estado de transacción

---

## ✅ Resultado de pruebas

* Pruebas unitarias con cobertura:

```bash
npm run test -- --coverage
```

* Screenshots, badges o estado: `✔️ Coverage > 80%`

---

## ✨ Autor

Desarrollado por [Deivi Bertel](https://github.com/Djbermor) – FullStack Developer

Perfecto, aquí tienes el **Paso 3: Guía para correr el proyecto localmente y en producción**, redactado para incluirlo directamente en el `README.md`:

---

### ✅ Paso 3: Cómo ejecutar el proyecto

````markdown
## ▶️ Cómo ejecutar el proyecto

### 🔧 Requisitos

- Node.js 18+
- npm o pnpm
- Acceso a las llaves de entorno (ej. `WOMPI_PUBLIC_KEY`)

---

### 💻 Ejecución en entorno local

1. Clona el repositorio:

```bash
git clone https://github.com/usuario/product-checkout-app.git
cd product-checkout-app
````

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` con la llave pública de Wompi:

```env
VITE_WOMPI_PUBLIC_KEY=pub_stagtest_xxxxxxxxxxxxxxxxx
```

4. Inicia el servidor local:

```bash
npm run dev
```

Accede desde [http://localhost:5173](http://localhost:5173)

---

### 🚀 Build para producción

```bash
npm run build
```

Esto genera una carpeta `dist/` lista para desplegar en Vercel, Netlify, o AWS S3.

---

### 🌐 Despliegue en producción (ejemplo con Vercel)

1. Sube tu repositorio a GitHub
2. Conéctalo en [https://vercel.com/new](https://vercel.com/new)
3. Configura:

   * Framework: `Vite`
   * Comando de build: `npm run build`
   * Directorio de salida: `dist`
4. Agrega tu variable de entorno:

   * `VITE_WOMPI_PUBLIC_KEY=pub_stagtest_xxxxxxxxxxxx`
5. ¡Deploy automático listo!

```

---
