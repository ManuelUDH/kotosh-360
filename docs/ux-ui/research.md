# Investigación UX/UI — Kotosh 360

## 1. Problema de diseño
El Complejo Arqueológico de Kotosh carece de mediación tecnológica interactiva. Los visitantes no disponen de señalización digital, guías en múltiples idiomas ni acceso a reconstrucciones visuales del sitio. Esto genera:
- Baja comprensión histórica del sitio.
- Experiencia turística de baja calidad y corta duración.
- Riesgo de contacto físico con estructuras frágiles al intentar explorar.

## 2. Personas identificadas

### 👤 Turista Nacional
- Edad: 25–50 años
- Motivación: Orgullo cultural, turismo de fin de semana
- Dispositivo: Android gama media
- Necesidad: Contexto histórico en español, guía fácil de usar

### 👤 Turista Internacional
- Edad: 28–60 años
- Motivación: Arqueología precolombina, patrimonio UNESCO
- Dispositivo: iPhone o Android premium
- Necesidad: Contenido en inglés, mapa interactivo

### 👤 Comunidad Quechua Local
- Edad: 15–70 años
- Motivación: Reconexión con herencia cultural
- Necesidad: Contenido en quechua, acceso sin datos móviles

## 3. Flujo de usuario principal

```
Llegada al sitio
    ↓
Apertura de la app (idioma auto / manual)
    ↓
Cámara AR activada → Escaneo de marcador físico
    ↓
Panel InfoPanel desplegado con:
  • Nombre del hotspot
  • Descripción histórica
  • Audio guía
  • Foto reconstrucción 3D
    ↓
Interacción / Cierre del panel
    ↓
Métrica enviada al backend
```

## 4. Principios de diseño
- **Mínima fricción**: el flujo scan→info debe tomar menos de 3 segundos.
- **Accesibilidad multilingüe**: ES / EN / QU desde el primer pantalla.
- **Sin datos obligatorios**: contenido crítico disponible offline (caché).
- **Preservación digital**: la app nunca reemplaza la visita física; la enriquece.

## 5. Wireframes
Ver carpeta `ui-design/` en `static-raw/` para mockups en formato Figma/PNG.
