using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class cartHandler : MonoBehaviour
{
    public int qtInCart = 0;
    public List<Article> articlesInCart;

    private websockets WS; 
    private ArticleUI articleUI;

    private void Awake()
    {
        WS = GameObject.Find("Store").GetComponent<websockets>();
        articleUI = GameObject.Find("ArticleUI").GetComponent<ArticleUI>();
    }

    public void addToCart()
    {
        WS.addToCart(articleUI.article.articleID);
        articlesInCart.Add(articleUI.article);
        qtInCart += 1;
        articleUI.close();
    }
}
