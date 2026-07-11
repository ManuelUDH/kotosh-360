using System;
using System.Text;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

namespace Kotosh360.Network
{
    /// <summary>
    /// Envía métricas de interacción al backend de Kotosh 360.
    /// </summary>
    public class NetworkManager : MonoBehaviour
    {
        [Header("API Config")]
        public string apiBase = "https://api.kotosh360.pe";

        private string _sessionId;

        void Awake()
        {
            _sessionId = Guid.NewGuid().ToString("N")[..8];
        }

        public void PostMetric(string hotspotId, string eventType)
            => StartCoroutine(PostMetricCoroutine(hotspotId, eventType, 0f));

        public void PostMetricWithDwell(string hotspotId, string eventType, float dwell)
            => StartCoroutine(PostMetricCoroutine(hotspotId, eventType, dwell));

        IEnumerator PostMetricCoroutine(string hotspotId, string eventType, float dwellTime)
        {
            var payload = new MetricPayload
            {
                sessionId = _sessionId,
                hotspotId = hotspotId,
                eventType = eventType,
                dwellTime = Mathf.RoundToInt(dwellTime),
                language  = Application.systemLanguage == SystemLanguage.Spanish ? "es" : "en",
                device    = SystemInfo.deviceModel
            };

            string json    = JsonUtility.ToJson(payload);
            byte[] bodyRaw = Encoding.UTF8.GetBytes(json);

            using var req = new UnityWebRequest($"{apiBase}/api/metrics", "POST");
            req.uploadHandler   = new UploadHandlerRaw(bodyRaw);
            req.downloadHandler = new DownloadHandlerBuffer();
            req.SetRequestHeader("Content-Type", "application/json");

            yield return req.SendWebRequest();

            if (req.result != UnityWebRequest.Result.Success)
                Debug.LogWarning($"[Network] Métrica no enviada: {req.error}");
            else
                Debug.Log($"[Network] Métrica enviada: {hotspotId}/{eventType}");
        }
    }

    [Serializable]
    public class MetricPayload
    {
        public string sessionId;
        public string hotspotId;
        public string eventType;
        public int    dwellTime;
        public string language;
        public string device;
    }
}
