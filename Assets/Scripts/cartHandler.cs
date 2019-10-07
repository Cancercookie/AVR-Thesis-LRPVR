using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class cartHandler : MonoBehaviour
{
    public List<Article> articlesInCart;
    private StoreLogic WS; 
    private ArticleUI articleUI;

    private void Awake()
    {
        WS = GameObject.Find("Store").GetComponent<StoreLogic>();
        articleUI = GameObject.Find("ArticleUI").GetComponent<ArticleUI>();
    }

    private void Update()
    {
        articleUI = GameObject.Find("ArticleUI").GetComponent<ArticleUI>();
    }

    public void addToCart()
    {
        WS.addToCart(articleUI.article);
        articlesInCart.Add(articleUI.article);
        articleUI.close();
    }
}
