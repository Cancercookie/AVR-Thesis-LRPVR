using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class cartHandler : MonoBehaviour
{
    public int qtInCart = 0;
    public List<Article> articlesInCart;

    private ArticleUI articleUI;

    private void Awake()
    {
        articleUI = GameObject.Find("ArticleUI").GetComponent<ArticleUI>();
    }

    public void addToCart()
    {
        qtInCart += 1;
        articlesInCart.Add(articleUI.article);
        articleUI.close();
    }
}
