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
    }

    private void Update()
    {
        gameObject.SetActive(happyFace.activeSelf);
        balloonTxt.text = textToSpeech;
        gameObject.SetActive(textToSpeech != "");
    }
}
