using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class AVRSays : MonoBehaviour
{
    private websockets WS;
    private Text balloonTxt;
    public string textToSpeech = "";

    private void Awake()
    {
        GameObject.Find("Store").GetComponent<websockets>();
        balloonTxt = gameObject.GetComponentInChildren<Text>();
    }

    private void Update()
    {
        balloonTxt.text = textToSpeech;
        gameObject.SetActive(textToSpeech != "");
    }
}
