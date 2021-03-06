﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Hints : MonoBehaviour
{
    // STATE, hint
    private Dictionary<string, string> hints = new Dictionary<string, string>();
    private websockets ws;
    private UIFader fader;

    private void Awake()
    {
        ws = GameObject.Find("Store").GetComponent<websockets>();
        hints.Add("ENDED", "Al momento il tuo assistente è in pausa. \nProva a richiamarlo dicendo: \"Computer avvia Shopper\"");
        hints.Add("STARTED", "Cosa puoi chiedermi: \n \"Aggiungi borsa al carrello\" \n \"Istruzioni\" \n \"Quanto costa jeans\" ");
        hints.Add("BOUGHT", "Cosa puoi chiedermi: \n \"Aggiungi borsa al carrello\" \n \"Istruzioni\" \n \"Quanto costa jeans\" ");
        hints.Add("CANBUY", "Cosa puoi chiedermi: \n \"Aggiungi borsa al carrello\" \n \"Istruzioni\" \n \"Quanto costa jeans\" \n \"Acquista\" ");
        gameObject.GetComponent<Text>().text = hints["ENDED"];
        fader = GameObject.FindGameObjectWithTag("Fader").GetComponent<UIFader>();
        gameObject.GetComponentInParent<CanvasGroup>().alpha = 0;
    }

    private void Start()
    {
        fader.FadeIn(gameObject.GetComponentInParent<CanvasGroup>());
    }

    private void Update()
    {
        gameObject.GetComponent<Text>().text = hints[ws.hintState];
    }
}
