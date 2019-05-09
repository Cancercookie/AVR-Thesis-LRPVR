using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BuyHandler : MonoBehaviour
{
    public Material greenLit;

    private cartHandler cart;
    private GameObject cashier;
    private websockets WS;
    
    void Awake()
    {
        WS = GameObject.Find("Store").GetComponent<websockets>();
        cart = GameObject.Find("ArticleUI/Canvas/AddToCartBtn/AddToCart").GetComponent<cartHandler>();
        cashier = GameObject.Find("Store/Checkout/Cashier");
    }

    void Update()
    {
        if (cart.qtInCart > 0)
        {
            cashier.GetComponent<Renderer>().materials[6] = greenLit;
        }
    }

    public void buyAll()
    {
        WS.buy();
        cart.qtInCart = 0;
    }
}
