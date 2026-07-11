using System.Collections.Generic;
using UnityEngine;

namespace Kotosh360
{
    /// <summary>
    /// Singleton que gestiona los clips de audio de cada hotspot.
    /// </summary>
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        [System.Serializable]
        public struct HotspotAudio
        {
            public string    hotspotId;
            public AudioClip clip;
        }

        public List<HotspotAudio> hotspotAudios;
        private AudioSource _source;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);
            _source = GetComponent<AudioSource>() ?? gameObject.AddComponent<AudioSource>();
        }

        public void PlayHotspotAudio(string hotspotId)
        {
            var entry = hotspotAudios.Find(h => h.hotspotId == hotspotId);
            if (entry.clip != null)
            {
                _source.Stop();
                _source.clip = entry.clip;
                _source.Play();
            }
            else
            {
                Debug.LogWarning($"[Audio] No hay clip para hotspot: {hotspotId}");
            }
        }

        public void StopAll() => _source.Stop();
    }
}
