using UnityEngine;
using Kotosh360.AR;
using Kotosh360.Network;

namespace Kotosh360.Simulation
{
    /// <summary>
    /// Simula el escaneo de marcadores AR en el editor de Unity al pulsar las teclas 1, 2, 3 o 4.
    /// Crea el panel en pantalla y envía métricas de red en tiempo real a tu API local.
    /// </summary>
    public class ARSimulator : MonoBehaviour
    {
        private ARManager _arManager;
        private NetworkManager _network;

        void Start()
        {
            _arManager = FindObjectOfType<ARManager>();
            _network = FindObjectOfType<NetworkManager>();
            Debug.Log("⌨️ [Kotosh 360 Simulador] ¡Simulador iniciado! Presiona las teclas 1, 2, 3 o 4 para simular escaneos de marcadores.");
        }

        void Update()
        {
            if (Input.GetKeyDown(KeyCode.Alpha1) || Input.GetKeyDown(KeyCode.Keypad1))
            {
                SimulateScan("manos_cruzadas");
            }
            else if (Input.GetKeyDown(KeyCode.Alpha2) || Input.GetKeyDown(KeyCode.Keypad2))
            {
                SimulateScan("altar_central");
            }
            else if (Input.GetKeyDown(KeyCode.Alpha3) || Input.GetKeyDown(KeyCode.Keypad3))
            {
                SimulateScan("muro_norte");
            }
            else if (Input.GetKeyDown(KeyCode.Alpha4) || Input.GetKeyDown(KeyCode.Keypad4))
            {
                SimulateScan("entrada_principal");
            }
        }

        private void SimulateScan(string markerId)
        {
            Debug.Log($"⌨️ [Simulador] Simulando escaneo de marcador: {markerId}");

            if (_arManager && _arManager.infoPanelPrefab)
            {
                Canvas canvas = FindObjectOfType<Canvas>();
                if (canvas)
                {
                    // Si ya existe un panel en pantalla, lo borramos para no sobreponerlos
                    Transform existing = canvas.transform.Find("SimulatedInfoPanel");
                    if (existing) Destroy(existing.gameObject);

                    // Instanciar panel en el canvas principal
                    GameObject panel = Instantiate(_arManager.infoPanelPrefab, canvas.transform);
                    panel.name = "SimulatedInfoPanel";

                    // Centrar panel y agrandarlo para pruebas en PC
                    RectTransform rect = panel.GetComponent<RectTransform>();
                    if (rect)
                    {
                        rect.anchoredPosition = Vector2.zero;
                        rect.localScale = Vector3.one * 1.5f;
                    }

                    // Inicializar textos y disparar métrica de vista
                    panel.GetComponent<InfoPanel>()?.Initialize(markerId);
                }
                else
                {
                    Debug.LogWarning("[Simulador] No se encontró un Canvas UI en la escena para mostrar el panel.");
                }
            }
            else
            {
                Debug.LogWarning("[Simulador] ARManager o infoPanelPrefab no están configurados.");
            }
        }
    }
}
