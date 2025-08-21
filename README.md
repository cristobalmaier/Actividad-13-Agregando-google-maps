# Rastreador de Ubicación con Mapa Interactivo

Una aplicación web que permite rastrear y visualizar tu ubicación en un mapa interactivo, con características adicionales como reproducción de sonidos y visualización de imágenes aleatorias de perros.

## Características

- 🗺️ Visualización de ubicación en tiempo real usando OpenStreetMap
- 🔊 Reproducción de sonidos ambientales basados en la ubicación
- 🐕 Generación de imágenes aleatorias de perros
- 🎚️ Interfaz de usuario intuitiva con indicadores de estado
- 📱 Diseño responsivo que funciona en dispositivos móviles y de escritorio

## Cómo Usar

1. **Obtener Ubicación**: Haz clic en el botón "Mi Ubicación" para comenzar a rastrear tu posición actual.
2. **Simular Movimiento**: Utiliza el botón "Simular Movimiento" para probar la funcionalidad de seguimiento.
3. **Reproducir Audio**: Experimenta con diferentes sonidos ambientales usando los controles de audio.
4. **Ver Fotos de Perros**: Haz clic en "Nueva Foto" para ver imágenes aleatorias de perros.

## Tecnologías Utilizadas

- HTML5, CSS3, JavaScript (ES6+)
- [Leaflet.js](https://leafletjs.com/) - Biblioteca de mapas interactivos
- [OpenStreetMap](https://www.openstreetmap.org/) - Proveedor de mapas
- [Dog API](https://dog.ceo/dog-api/) - API de imágenes de perros
- Web Audio API - Para generación de sonidos

## Requisitos del Sistema

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet (para cargar los mapas y la API de perros)
- Permiso de ubicación del navegador habilitado

## Instalación

No se requiere instalación. Simplemente abre el archivo `index.html` en tu navegador web favorito.

```bash
git clone [https://github.com/cristobalmaier/Actividad-13-Agregando-google-maps.git]
cd Actividad-13-Agregando-google-maps
open index.html
```

## Personalización

Puedes personalizar la aplicación modificando los siguientes archivos:

- `style.css` - Para cambios en el diseño y la apariencia
- `script.js` - Para modificar la lógica de la aplicación
- `index.html` - Para cambios en la estructura de la página

## Notas

- La aplicación requiere permisos de ubicación para funcionar correctamente.
- Las imágenes de perros son proporcionadas por la Dog API de forma aleatoria.
