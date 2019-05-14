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

    private void Awake()
    {
        happyFace = GameObject.FindGameObjectWithTag("HappyFace");
        GameObject.Find("Store").GetComponent<websockets>();
        balloonTxt = gameObject.GetComponentInChildren<Text>();
        gameObject.SetActive(false);
    }

    private void Update()
    {
        balloonTxt.text = textToSpeech;
        gameObject.SetActive(textToSpeech != "");
    }
}
