using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Hints : MonoBehaviour
{
    // STATE, hint
    private Dictionary<string, string> hints = new Dictionary<string, string>();
    private websockets ws;

    private void Awake()
    {
        ws = GameObject.Find("Store").GetComponent<websockets>();
        hints.Add("PAUSED", "Al momento il tuo assistente è in pausa. Prova a richiamarlo dicendo: \"Computer avvia Shopper\"");
        hints.Add("STARTED", "Ciao! Se vuoi puoi chiedermi: ");
    }

    private void Start()
    {
        gameObject.GetComponent<Text>().text =  ws.hintState;
    }
}
