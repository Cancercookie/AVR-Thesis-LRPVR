using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class cartHandler : MonoBehaviour
{
    public List<Article> articlesInCart;
    private websockets WS; 
    private ArticleUI articleUI;

    private void Awake()
    {
        WS = GameObject.Find("Store").GetComponent<websockets>();
        articleUI = GameObject.Find("ArticleUI").GetComponent<ArticleUI>();
    }

    private void Update()
    {
        articleUI = GameObject.Find("ArticleUI").GetComponent<ArticleUI>();
    }

    public void addToCart()
    {
        WS.addToCart(articleUI.article.articleID);
        WS.cartPrice += articleUI.article.price;
        articlesInCart.Add(articleUI.article); // mettere in WS
        articleUI.close();
    }
}
