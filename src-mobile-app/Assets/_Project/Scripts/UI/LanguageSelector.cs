using UnityEngine;
using UnityEngine.UI;

namespace Kotosh360.UI
{
    /// <summary>
    /// Selector de idioma en la pantalla de bienvenida.
    /// </summary>
    public class LanguageSelector : MonoBehaviour
    {
        public Button btnEspanol;
        public Button btnEnglish;
        public Button btnQuechua;

        public static string CurrentLanguage { get; private set; } = "es";

        void Start()
        {
            btnEspanol?.onClick.AddListener(() => SetLanguage("es"));
            btnEnglish?.onClick.AddListener(() => SetLanguage("en"));
            btnQuechua?.onClick.AddListener(() => SetLanguage("qu"));
        }

        void SetLanguage(string lang)
        {
            CurrentLanguage = lang;
            PlayerPrefs.SetString("language", lang);
            PlayerPrefs.Save();
            Debug.Log($"[UI] Idioma seleccionado: {lang}");
        }
    }
}
