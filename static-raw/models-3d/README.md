# models-3d/

Esta carpeta contiene los modelos 3D fotorrealistas del sitio arqueológico.

## Archivos esperados

| Archivo                    | Formato   | Descripción                              |
|----------------------------|-----------|------------------------------------------|
| kotosh_manos_cruzadas.glb  | GLB/GLTF  | Modelo principal — Templo Manos Cruzadas |
| altar_central.glb          | GLB/GLTF  | Altar central de ofrendas                |
| reconstruccion_2000ac.fbx  | FBX       | Reconstrucción hipotética ~2000 a.C.     |
| muro_norte_textura.obj     | OBJ+MTL   | Muro norte con materiales PBR            |

## Flujo de producción

1. **Generación de conceptos**: Prompts en `/prompts/` para IA generativa (Midjourney, DALL-E, etc.)
2. Fotogrametría con DJI Mavic 3 + cámara DSLR (500+ fotos por estructura)
3. Procesado en Agisoft Metashape → nube de puntos + malla
4. Retopología y UVs en Blender
5. Texturizado PBR en Substance Painter
6. Exportación a GLB para AR Foundation / WebGL
