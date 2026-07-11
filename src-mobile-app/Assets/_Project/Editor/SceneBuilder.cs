#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using UnityEditor.SceneManagement;
using UnityEngine.XR.ARFoundation;
using Kotosh360.AR;
using Kotosh360.Network;

namespace Kotosh360.Editor
{
    /// <summary>
    /// Script de Editor para automatizar la creación de la escena AR de Kotosh 360.
    /// Crea la estructura recomendada en MainScene.md y asocia los componentes y scripts.
    /// </summary>
    public class SceneBuilder : EditorWindow
    {
        [MenuItem("Kotosh 360/Build Main Scene 🏛️")]
        public static void BuildMainScene()
        {
            // 1. Crear una nueva escena limpia
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);

            // 2. Luz Direccional (Iluminación básica)
            var lightObj = new GameObject("Directional Light");
            var lightComponent = lightObj.AddComponent<Light>();
            lightComponent.type = LightType.Directional;
            lightComponent.intensity = 1.0f;
            lightComponent.color = new Color(1f, 0.95f, 0.85f); // Luz cálida
            lightObj.transform.rotation = Quaternion.Euler(50f, -30f, 0f);

            // 3. AR Session
            var arSessionObj = new GameObject("AR Session");
            arSessionObj.AddComponent<ARSession>();

            // 4. AR Session Origin
            var arOriginObj = new GameObject("AR Session Origin");
            var origin = arOriginObj.AddComponent<ARSessionOrigin>();
            var imageManager = arOriginObj.AddComponent<ARTrackedImageManager>();

            // Cámara AR (hijo de AR Session Origin)
            var camObj = new GameObject("AR Camera");
            camObj.transform.SetParent(arOriginObj.transform);
            camObj.transform.localPosition = Vector3.zero;
            camObj.transform.localRotation = Quaternion.identity;

            var camera = camObj.AddComponent<Camera>();
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = Color.black;
            camera.nearClipPlane = 0.1f;
            camera.farClipPlane = 20f;

            camObj.AddComponent<ARCameraManager>();
            camObj.AddComponent<ARCameraBackground>();

            // Enlazar cámara al origen
            origin.camera = camera;

            // 5. Crear la carpeta / Contenedor de Managers
            var managersObj = new GameObject("Managers");

            // NetworkManager
            var netObj = new GameObject("NetworkManager");
            netObj.transform.SetParent(managersObj.transform);
            var netManager = netObj.AddComponent<NetworkManager>();
            netManager.apiBase = "http://localhost:5000"; // Conexión al backend de Node.js local

            // ARManager
            var arManagerObj = new GameObject("ARManager");
            arManagerObj.transform.SetParent(managersObj.transform);
            var arManager = arManagerObj.AddComponent<ARManager>();
            arManager.trackedImageManager = imageManager;

            // Agregar componente Simulador de teclado
            arManagerObj.AddComponent<Kotosh360.Simulation.ARSimulator>();

            // Crear Prefab del InfoPanel en 3D/WorldSpace
            GameObject panelPrefabObj = new GameObject("InfoPanelPrefab", typeof(RectTransform));
            var panelRect = panelPrefabObj.GetComponent<RectTransform>();
            panelRect.sizeDelta = new Vector2(3f, 2f); // 3 metros de ancho, 2 de alto
            panelRect.localScale = Vector3.one * 0.1f; // Escala adecuada para AR

            var canvasComp = panelPrefabObj.AddComponent<Canvas>();
            canvasComp.renderMode = RenderMode.WorldSpace;
            panelPrefabObj.AddComponent<UnityEngine.UI.CanvasScaler>();
            panelPrefabObj.AddComponent<UnityEngine.UI.GraphicRaycaster>();

            // Panel de fondo oscuro
            GameObject bgObj = new GameObject("Background", typeof(RectTransform));
            bgObj.transform.SetParent(panelPrefabObj.transform, false);
            var bgRect = bgObj.GetComponent<RectTransform>();
            bgRect.anchorMin = Vector2.zero;
            bgRect.anchorMax = Vector2.one;
            bgRect.sizeDelta = Vector2.zero;
            var bgImg = bgObj.AddComponent<UnityEngine.UI.Image>();
            bgImg.color = new Color(0.12f, 0.12f, 0.12f, 0.95f);

            // Script de InfoPanel
            var infoPanel = panelPrefabObj.AddComponent<InfoPanel>();

            // Título (TextMeshPro)
            GameObject titleObj = new GameObject("TitleText", typeof(RectTransform));
            titleObj.transform.SetParent(panelPrefabObj.transform, false);
            var titleRect = titleObj.GetComponent<RectTransform>();
            titleRect.anchoredPosition = new Vector2(0f, 0.7f);
            titleRect.sizeDelta = new Vector2(2.8f, 0.4f);
            var titleTextComp = titleObj.AddComponent<TMPro.TextMeshProUGUI>();
            titleTextComp.fontSize = 0.25f;
            titleTextComp.alignment = TMPro.TextAlignmentOptions.Center;
            titleTextComp.color = Color.yellow;
            infoPanel.titleText = titleTextComp;

            // Descripción (TextMeshPro)
            GameObject descObj = new GameObject("DescText", typeof(RectTransform));
            descObj.transform.SetParent(panelPrefabObj.transform, false);
            var descRect = descObj.GetComponent<RectTransform>();
            descRect.anchoredPosition = new Vector2(0f, -0.1f);
            descRect.sizeDelta = new Vector2(2.8f, 1f);
            var descTextComp = descObj.AddComponent<TMPro.TextMeshProUGUI>();
            descTextComp.fontSize = 0.15f;
            descTextComp.alignment = TMPro.TextAlignmentOptions.Center;
            descTextComp.color = Color.white;
            descTextComp.enableWordWrapping = true;
            infoPanel.descriptionText = descTextComp;

            // Botón de cerrar
            GameObject closeBtnObj = new GameObject("CloseButton", typeof(RectTransform));
            closeBtnObj.transform.SetParent(panelPrefabObj.transform, false);
            var closeRect = closeBtnObj.GetComponent<RectTransform>();
            closeRect.anchoredPosition = new Vector2(0f, -0.7f);
            closeRect.sizeDelta = new Vector2(1.2f, 0.35f);
            var closeImg = closeBtnObj.AddComponent<UnityEngine.UI.Image>();
            closeImg.color = new Color(0.75f, 0.22f, 0.22f, 1f);
            var closeBtn = closeBtnObj.AddComponent<UnityEngine.UI.Button>();
            infoPanel.closeButton = closeBtn;

            // Texto de botón de cerrar (Standard UI Text)
            GameObject closeTxtObj = new GameObject("Text", typeof(RectTransform));
            closeTxtObj.transform.SetParent(closeBtnObj.transform, false);
            var closeTxtRect = closeTxtObj.GetComponent<RectTransform>();
            closeTxtRect.sizeDelta = new Vector2(1.2f, 0.35f);
            var closeTxt = closeTxtObj.AddComponent<UnityEngine.UI.Text>();
            closeTxt.text = "CERRAR";
            closeTxt.alignment = TextAnchor.MiddleCenter;
            closeTxt.fontSize = 12;
            closeTxt.color = Color.white;
            closeTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");

            // Guardar el Prefab creado programáticamente
            if (!System.IO.Directory.Exists("Assets/_Project/Prefabs"))
            {
                System.IO.Directory.CreateDirectory("Assets/_Project/Prefabs");
            }
            string prefabPath = "Assets/_Project/Prefabs/InfoPanel.prefab";
            GameObject prefabAsset = PrefabUtility.SaveAsPrefabAsset(panelPrefabObj, prefabPath);
            DestroyImmediate(panelPrefabObj);

            // Asignar el prefab al ARManager
            arManager.infoPanelPrefab = prefabAsset;

            // 6. Crear Canvas de UI para el HUD básico
            var canvasObj = new GameObject("UI Canvas");
            var canvas = canvasObj.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvasObj.AddComponent<UnityEngine.UI.CanvasScaler>();
            canvasObj.AddComponent<UnityEngine.UI.GraphicRaycaster>();

            // Texto de bienvenida en el HUD
            var hudObj = new GameObject("HUD Text");
            hudObj.transform.SetParent(canvasObj.transform);
            var rect = hudObj.AddComponent<RectTransform>();
            rect.anchoredPosition = new Vector2(0f, 200f);
            rect.sizeDelta = new Vector2(500f, 150f);

            var text = hudObj.AddComponent<UnityEngine.UI.Text>();
            text.text = "🏛️ KOTOSH 360\n[ Vista Realidad Aumentada ]\n\nEscanea los marcadores para ver los modelos 3D.";
            text.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            text.fontSize = 24;
            text.alignment = TextAnchor.MiddleCenter;
            text.color = new Color(0.79f, 0.66f, 0.3f); // Dorado Kotosh

            // Asegurar que la carpeta Scenes existe
            if (!System.IO.Directory.Exists("Assets/_Project/Scenes"))
            {
                System.IO.Directory.CreateDirectory("Assets/_Project/Scenes");
            }

            // Guardar la escena en la carpeta correcta
            string path = "Assets/_Project/Scenes/MainScene.unity";
            EditorSceneManager.SaveScene(scene, path);

            // Registrar la escena en la lista de Build Settings para pruebas automáticas
            var originalScenes = EditorBuildSettings.scenes;
            var newScenes = new EditorBuildSettingsScene[1] { new EditorBuildSettingsScene(path, true) };
            EditorBuildSettings.scenes = newScenes;

            // Refrescar assets y loguear éxito
            AssetDatabase.Refresh();
            Debug.Log("✅ [Kotosh 360] ¡La escena principal se ha auto-construido correctamente con cámaras AR, managers y HUD en 'Assets/_Project/Scenes/MainScene.unity'!");
            
            // Abrir la escena recién creada
            EditorSceneManager.OpenScene(path);
        }
    }
}
#endif
