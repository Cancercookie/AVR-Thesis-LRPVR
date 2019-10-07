using System;
using System.Collections.Generic;
using System.Collections;
using System.Text;
using System.Threading;
using System.Net.WebSockets;
using UnityEngine;

public class StoreLogic : MonoBehaviour
{
    readonly Uri u = new Uri("wss://cxr4c7tqeh.execute-api.eu-west-1.amazonaws.com/production");
    private ClientWebSocket cws = null;
    private ArraySegment<byte> buf = new ArraySegment<byte>(new byte[1024]);

    private GameObject[] spawners;
    private GameObject[] articles;
    private List<DBArticle> articleInfos = new List<DBArticle>();
    public int qtInCart;
    public double cartPrice;
    public string state;
    private UIFader fader;
    private GameObject cashier;
    private BuyHandler buyH;

    private void Awake()
    {
        qtInCart = 0;
        cartPrice = 0;
        state = "ENDED";
        spawners = GameObject.FindGameObjectsWithTag("Spawner");
        articles = GameObject.FindGameObjectsWithTag("Article");
        fader = GameObject.FindGameObjectWithTag("Fader").GetComponent<UIFader>();
        cashier = GameObject.Find("Store/Checkout/Cashier");
        buyH = GameObject.Find("Store/Checkout/CheckoutCanvas/Buy").GetComponent<BuyHandler>();
	}

    private void Update()
    {
        if (qtInCart > 0 && state == "STARTED")
            state = "CANBUY";
        if (state == "ENDED")
		{
		}
		if (qtInCart > 0)
        {
            transform.Find("Checkout/Arrow").gameObject.SetActive(true);
            transform.Find("Checkout/Arrow").GetComponent<Animation>().Play();
        }
        else
             transform.Find("Checkout/Arrow").gameObject.SetActive(false);
        
    }

    async void WSGetTotal()
    {
    }

    public async void addToCart(Article article)
    {
		qtInCart += 1;
		cartPrice += article.price;
        Debug.Log(article);
    }

    public async void buy(bool fromUnity = true)
    {
        GameObject.FindGameObjectWithTag("Confetti").GetComponent<ParticleSystem>().Play();
        GameObject.FindGameObjectWithTag("Confetti").transform.GetChild(0).GetComponent<AudioSource>().Play();
        qtInCart = 0;
        cartPrice = 0;
    }

}

[Serializable]
public class DBArticle
{
    public string articleID;
    public string description;
    public double price;
    public string name;
}

[Serializable]
public class DBCartPrice
{
    public string cartPrice;
}