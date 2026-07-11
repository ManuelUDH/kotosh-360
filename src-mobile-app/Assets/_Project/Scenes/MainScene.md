# Escena Principal — MainScene

## Jerarquía de objetos recomendada

```
MainScene
├── [AR Session]           ← ARSession component
├── [AR Session Origin]    ← ARSessionOrigin + ARTrackedImageManager
│   └── AR Camera          ← Camera + ARCameraManager
├── Managers
│   ├── ARManager          ← Scripts/AR/ARManager.cs
│   ├── NetworkManager     ← Scripts/Network/NetworkManager.cs
│   └── AudioManager       ← Scripts/UI/AudioManager.cs
├── UI Canvas
│   ├── WelcomePanel
│   │   └── LanguageSelector
│   └── HUD
│       └── ScanPrompt
└── Lighting
    └── Directional Light
```

## Configuración requerida en Unity

1. **XR Plugin Management**: instalar AR Foundation + ARCore (Android) / ARKit (iOS)
2. **Reference Image Library**: agregar imágenes de los marcadores AR en `Assets/_Project/`
   - marker_manos.jpg
   - marker_altar.jpg
   - marker_muro.jpg
   - marker_entrada.jpg
3. **Prefab InfoPanel**: asignar en ARManager → infoPanelPrefab
4. **Build Settings**: Android (API 26+) o iOS (14+)
