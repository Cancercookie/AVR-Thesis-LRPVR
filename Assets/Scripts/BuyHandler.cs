﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BuyHandler : MonoBehaviour
{
    public Material greenLit;

    private cartHandler cart;
    private GameObject cashier;
    private websockets WS;
    private ArticleUI articleUI;
    private int count;
    private Material stdMat;
    
    void Awake()
    {
        WS = GameObject.Find("Store").GetComponent<websockets>();
        cart = GameObject.Find("ArticleUI/Canvas/AddToCartBtn/AddToCart").GetComponent<cartHandler>();
        articleUI = GameObject.Find("ArticleUI").GetComponent<ArticleUI>();
        cashier = GameObject.Find("Store/Checkout/Cashier");
        stdMat = cashier.GetComponent<Renderer>().materials[6];
        count = 0;
    }

    void Update()
    {
        if (WS.qtInCart > 0)
        {
            if(count <= 60)
            {
                cashier.GetComponent<Renderer>().materials[6] = greenLit;
            }
            else if(count <= 120)
            {
                cashier.GetComponent<Renderer>().materials[6] = stdMat;
            }
            else
            {
                count = 0;
            }
            count += 1;
        }
        else
        {
            count = 0;
        }
            
    }

    public void buyAll()
    {
        WS.buy();
        WS.qtInCart = 0;
    }
}
