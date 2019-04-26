using System;
using System.Text;
using System.Threading;
using System.Net.WebSockets;
using UnityEngine;

public class websockets : MonoBehaviour
{
    readonly Uri u = new Uri("wss://cxr4c7tqeh.execute-api.eu-west-1.amazonaws.com/production");
    ClientWebSocket cws = null;
    ArraySegment<byte> buf = new ArraySegment<byte>(new byte[1024]);

    // Start is called before the first frame update
    void Start()
    {
        Connect();
    }

    async void Connect()
    {
        cws = new ClientWebSocket();
        try
        {
            await cws.ConnectAsync(u, CancellationToken.None);
            if (cws.State == WebSocketState.Open) Debug.Log("connected");
            WSRead();
            WSReceiver();
        }
        catch (Exception e) { Debug.Log("Web Socket Exception:  " + e.Message); }
    }

    async void WSRead()
    {
        ArraySegment<byte> b = new ArraySegment<byte>(Encoding.UTF8.GetBytes("{action: read}"));
        await cws.SendAsync(b, WebSocketMessageType.Text, true, CancellationToken.None);
    }

    
    async void WSReceiver()
    {
        WebSocketReceiveResult r = await cws.ReceiveAsync(buf, CancellationToken.None);
        Debug.Log("Got: " + Encoding.UTF8.GetString(buf.Array, 0, r.Count));
        WSReceiver();
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
