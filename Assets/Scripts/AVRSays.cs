using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class AVRSays : MonoBehaviour
{
    private websockets WS;
    private Text balloonTxt;
    public string textToSpeech = "";
    private GameObject happyFace;
    private UIFader fader;

    private void Awake()
    {
        happyFace = GameObject.FindGameObjectWithTag("HappyFace");
        GameObject.Find("Store").GetComponent<websockets>();
        balloonTxt = gameObject.GetComponentInChildren<Text>();
        fader = GameObject.FindGameObjectWithTag("Fader").GetComponent<UIFader>();
        gameObject.GetComponentInParent<CanvasGroup>().alpha = 0;
    }

    private void Start()
    {
        fader.FadeIn(gameObject.GetComponentInParent<CanvasGroup>());
    }

    private void Update()
    {
        balloonTxt.text = textToSpeech;
    }
}
