using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Kotosh360.Network;

namespace Kotosh360.AR
{
    /// <summary>
    /// Panel de información superpuesto en el marcador AR.
    /// Muestra nombre, descripción e imagen del hotspot.
    /// </summary>
    public class InfoPanel : MonoBehaviour
    {
        [Header("UI References")]
        public TextMeshProUGUI titleText;
        public TextMeshProUGUI descriptionText;
        public Image           thumbnailImage;
        public Button          closeButton;
        public Button          audioButton;

        private string  _hotspotId;
        private float   _openTime;

        // Datos localizados (cargados desde HotspotData)
        private static readonly Dictionary<string, (string es, string en, string qu)> Descriptions = new()
        {
            ["manos_cruzadas"] = (
                "El símbolo más icónico de Kotosh (~2000 a.C.). Las manos cruzadas representan una ofrenda sagrada.",
                "The most iconic symbol of Kotosh (~2000 BC). The crossed hands represent a sacred offering.",
                "Kotosh nisqap rikch'aq siq'i. Chakiyuq makikuna wak'a qukuyta rikuchin."
            ),
            ["altar_central"] = (
                "Espacio ceremonial principal donde se realizaban rituales de fuego y ofrendas colectivas.",
                "Main ceremonial space where fire rituals and collective offerings were performed.",
                "Hatun wak'a. Ninapi ayni ruwakuq."
            ),
            ["muro_norte"] = (
                "Muro de adobe original con pigmentación ocre, parte del segundo período constructivo (~1800 a.C.).",
                "Original adobe wall with ochre pigmentation, part of the second construction period (~1800 BC).",
                "Qello pirqa. Iskay kay pachapi ruwasqa."
            ),
            ["entrada_principal"] = (
                "Portal de acceso al recinto sagrado, orientado al solsticio de verano.",
                "Access portal to the sacred precinct, oriented toward the summer solstice.",
                "Hatun punku. Inti p'unchaw ch'uyarisqapi kicharisqa."
            ),
        };

        void Start()
        {
            closeButton?.onClick.AddListener(OnClose);
            audioButton?.onClick.AddListener(OnPlayAudio);
        }

        public void Initialize(string hotspotId)
        {
            _hotspotId = hotspotId;
            _openTime  = Time.time;

            string lang = Application.systemLanguage == SystemLanguage.Spanish ? "es"
                        : Application.systemLanguage == SystemLanguage.Unknown  ? "qu" : "en";

            if (Descriptions.TryGetValue(hotspotId, out var desc))
            {
                if (titleText)       titleText.text = hotspotId.Replace("_", " ").ToUpper();
                if (descriptionText) descriptionText.text = lang switch {
                    "es" => desc.es,
                    "en" => desc.en,
                    _    => desc.qu
                };
            }

            FindObjectOfType<NetworkManager>()?.PostMetric(hotspotId, "view");
        }

        void OnClose()
        {
            float dwell = Time.time - _openTime;
            FindObjectOfType<NetworkManager>()?.PostMetricWithDwell(_hotspotId, "interaction", dwell);
            gameObject.SetActive(false);
        }

        void OnPlayAudio()
        {
            AudioManager.Instance?.PlayHotspotAudio(_hotspotId);
        }
    }
}
