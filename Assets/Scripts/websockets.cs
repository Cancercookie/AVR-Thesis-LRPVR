using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using WebSocketSharp;

public class websockets : MonoBehaviour
{
    public WebSocket ws = new WebSocket("wss://cxr4c7tqeh.execute-api.eu-west-1.amazonaws.com/production");
    // Start is called before the first frame update
    void Start()
    {
        ws.OnOpen += (sender, e) => {
            Debug.Log("connection");
        };
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
