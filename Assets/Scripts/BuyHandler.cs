using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BuyHandler : MonoBehaviour
{
    private cartHandler cart;
    private GameObject cashier;
    public Material greenLit;
    void Awake()
    {
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
        cart.qtInCart = 0;
        // AZIONE WS
    }
}
