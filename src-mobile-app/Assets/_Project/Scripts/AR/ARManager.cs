using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;
using Kotosh360.Network;

namespace Kotosh360.AR
{
    /// <summary>
    /// Gestiona el ciclo de vida del sistema AR:
    /// detección de imágenes, activación de prefabs y envío de métricas.
    /// </summary>
    public class ARManager : MonoBehaviour
    {
        [Header("AR Components")]
        public ARTrackedImageManager trackedImageManager;
        public GameObject            infoPanelPrefab;

        [Header("Settings")]
        public float autoHideDelay = 15f;

        private readonly Dictionary<string, GameObject> _spawnedPanels = new();
        private NetworkManager _network;

        void Awake()
        {
            _network = FindObjectOfType<NetworkManager>();
        }

        void OnEnable()
        {
            trackedImageManager.trackedImagesChanged += OnTrackedImagesChanged;
        }

        void OnDisable()
        {
            trackedImageManager.trackedImagesChanged -= OnTrackedImagesChanged;
        }

        void OnTrackedImagesChanged(ARTrackedImagesChangedEventArgs args)
        {
            foreach (var image in args.added)
                HandleImageAdded(image);

            foreach (var image in args.updated)
                HandleImageUpdated(image);

            foreach (var image in args.removed)
                HandleImageRemoved(image);
        }

        void HandleImageAdded(ARTrackedImage image)
        {
            string markerId = image.referenceImage.name;
            Debug.Log($"[AR] Marker detectado: {markerId}");

            if (!_spawnedPanels.ContainsKey(markerId))
            {
                var panel = Instantiate(infoPanelPrefab, image.transform);
                panel.GetComponent<InfoPanel>()?.Initialize(markerId);
                _spawnedPanels[markerId] = panel;
                StartCoroutine(AutoHide(markerId));
            }

            _network?.PostMetric(markerId, "scan");
        }

        void HandleImageUpdated(ARTrackedImage image)
        {
            string markerId = image.referenceImage.name;
            if (_spawnedPanels.TryGetValue(markerId, out var panel))
            {
                bool isTracking = image.trackingState == TrackingState.Tracking;
                panel.SetActive(isTracking);
                panel.transform.SetPositionAndRotation(image.transform.position, image.transform.rotation);
            }
        }

        void HandleImageRemoved(ARTrackedImage image)
        {
            string markerId = image.referenceImage.name;
            if (_spawnedPanels.TryGetValue(markerId, out var panel))
            {
                Destroy(panel);
                _spawnedPanels.Remove(markerId);
            }
        }

        IEnumerator AutoHide(string markerId)
        {
            yield return new WaitForSeconds(autoHideDelay);
            if (_spawnedPanels.TryGetValue(markerId, out var panel) && panel != null)
                panel.SetActive(false);
        }
    }
}
