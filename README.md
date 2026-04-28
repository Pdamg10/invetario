# Sistema de Inventario Web 📦

Un sistema de gestión de inventario moderno, rápido y ligero construido con **HTML**, **CSS** y **JavaScript puro (Vanilla JS)**. Ideal para llevar el control de productos, stock y valor total del inventario directamente desde el navegador web.

## 🚀 Características Principales

- **Gestión Completa (CRUD):** Añade, edita, elimina y visualiza tus productos fácilmente.
- **Búsqueda en Tiempo Real:** Encuentra artículos rápidamente por nombre, SKU o nombre del proveedor.
- **Filtros Avanzados:** Organiza y filtra tu inventario por categoría (Electrónica, Ropa, Hogar, etc.) o por estado (Activo, Inactivo, Descontinuado).
- **Control y Alertas de Stock:** Indicadores visuales automáticos para productos con stock bajo o crítico.
- **Dashboard de Estadísticas:** Panel resumen en la cabecera con:
  - Cantidad total de productos registrados.
  - Valor total acumulado del inventario (Precio × Stock).
  - Contador de alertas de artículos con bajo stock.
- **Persistencia Local:** Todos los datos se guardan de forma segura en el `localStorage` de tu navegador. Tu información se mantiene incluso si cierras la pestaña o recargas la página.
- **Diseño Moderno y Responsivo:** Interfaz limpia, intuitiva y adaptable a diferentes tamaños de pantalla, construida de forma modular.

## 🛠️ Tecnologías Utilizadas

El proyecto no depende de frameworks ni librerías externas, manteniendo el código ligero y fácil de entender:

- **HTML5:** Estructura semántica de la aplicación (`INVENTARIO.html`).
- **CSS3:** Estilos personalizados, diseño limpio y notificaciones tipo toast (`styles.css`).
- **JavaScript (ES6+):** Lógica de negocio, manipulación dinámica del DOM y persistencia de datos (`app.js`).

## 📁 Estructura del Proyecto

El código está modularizado para facilitar su mantenimiento:

```text
/
├── INVENTARIO.html  # Archivo principal con la estructura de la aplicación y la interfaz
├── styles.css       # Hoja de estilos (colores, layout, tipografías y animaciones)
├── app.js           # Lógica principal, funciones CRUD, filtros y renderizado
└── README.md        # Documentación del proyecto
```

## 💻 Instalación y Uso

¡Es muy fácil de usar! No necesitas instalar Node.js, dependencias ni configurar un servidor web local.

1. **Clona este repositorio** en tu computadora:
   ```bash
   git clone https://github.com/Pdamg10/invetario.git
   ```
2. **Abre el proyecto:** Simplemente haz doble clic sobre el archivo `INVENTARIO.html` para abrirlo en tu navegador web preferido (Google Chrome, Firefox, Edge, Safari, etc.).
3. **¡Listo!** Puedes empezar a añadir tus productos. La primera vez que abras la aplicación, se generarán algunos datos de prueba (semilla) automáticamente para que veas cómo funciona.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar esta aplicación (como añadir exportación a Excel, conexión a una base de datos real, etc.), siéntete libre de:

1. Hacer un _Fork_ del proyecto.
2. Crear tu rama con la nueva característica (`git checkout -b feature/NuevaCaracteristica`).
3. Hacer _Commit_ de tus cambios (`git commit -m 'Añadida nueva característica'`).
4. Hacer _Push_ a la rama (`git push origin feature/NuevaCaracteristica`).
5. Abrir un _Pull Request_.

---

*Proyecto desarrollado y modularizado para facilitar la gestión eficiente y rápida de inventarios pequeños y medianos.*
