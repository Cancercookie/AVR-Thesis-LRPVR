using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class BuyHandler : MonoBehaviour
{
    private StoreLogic sl;
        
    void Awake()
    {
        sl = GameObject.Find("Store").GetComponent<StoreLogic>();
    }

    public void buyAll()
    {
        sl.buy();
    }

    public void Update()
    {
        GameObject.Find("Store/Checkout/CheckoutCanvas/Total").GetComponent<Text>().text = sl.cartPrice + "€";
    }
}
