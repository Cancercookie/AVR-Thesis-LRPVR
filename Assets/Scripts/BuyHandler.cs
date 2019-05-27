using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class BuyHandler : MonoBehaviour
{
    private websockets WS;
        
    void Awake()
    {
        WS = GameObject.Find("Store").GetComponent<websockets>();
    }

    public void buyAll()
    {
        WS.buy();
    }

    public void Update()
    {
        GameObject.Find("Store/Checkout/CheckoutCanvas/Total").GetComponent<Text>().text = WS.cartPrice + "€";
    }
}
