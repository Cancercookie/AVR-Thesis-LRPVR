using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AVRSays : MonoBehaviour
{
    private websockets WS;

    private void Awake()
    {
        GameObject.Find("Store").GetComponent<websockets>();
    }
}
