using System;
using System.Collections.Generic;
using System.Collections;
using System.Text;
using System.Threading;
using System.Net.WebSockets;
using UnityEngine;

public class websockets : MonoBehaviour
{
    readonly Uri u = new Uri("wss://cxr4c7tqeh.execute-api.eu-west-1.amazonaws.com/production");
    private ClientWebSocket cws = null;
    private ArraySegment<byte> buf = new ArraySegment<byte>(new byte[1024]);

    private string state = "idle";
    private string res = "";
    private GameObject[] spawners;
    private GameObject[] articles;
    private List<DBArticle> articleInfos = new List<DBArticle>();
    private AVRSays balloon;
    private GameObject happyFace;
    public int qtInCart;
    public string cartPrice;
    public string hintState;
    private UIFader fader;
    private GameObject cashier;
    private BuyHandler buyH;

    private void Awake()
    {
        qtInCart = 0;
        cartPrice = "0";
        hintState = "ENDED";
        spawners = GameObject.FindGameObjectsWithTag("Spawner");
        articles = GameObject.FindGameObjectsWithTag("Article");
        balloon = GameObject.FindGameObjectWithTag("Balloon").GetComponent<AVRSays>();
        happyFace = GameObject.FindGameObjectWithTag("HappyFace");
        happyFace.SetActive(false);
        fader = GameObject.FindGameObjectWithTag("Fader").GetComponent<UIFader>();
        cashier = GameObject.Find("Store/Checkout/Cashier");
        buyH = GameObject.Find("Store/Checkout/CheckoutCanvas/Buy").GetComponent<BuyHandler>();
        Connect();
    }

    private void Update()
    {
        if (qtInCart > 0 && hintState == "STARTED")
            hintState = "CANBUY";
        if (hintState == "ENDED" && balloon.gameObject.GetComponent<CanvasGroup>().alpha == 1)
            StartCoroutine(Hide());
        if (qtInCart > 0)
        {
            transform.Find("Checkout/Arrow").gameObject.SetActive(true);
            transform.Find("Checkout/Arrow").GetComponent<Animation>().Play();
        }
        else
             transform.Find("Checkout/Arrow").gameObject.SetActive(false);
        
    }

    private IEnumerator Hide(bool face = true)
    {
        yield return new WaitForSeconds(5);
        fader.FadeOut(balloon.gameObject.GetComponent<CanvasGroup>());
        if (face) happyFace.SetActive(false);
    }

    async void Connect()
    {
        cws = new ClientWebSocket();
        try
        {
            await cws.ConnectAsync(u, CancellationToken.None);
            if (cws.State == WebSocketState.Open) Debug.Log("connected");
            WSGetArticles();
            WSReceiver();
        }
        catch (Exception e) { Debug.Log("Web Socket Exception:  " + e.Message); }
    }

    async void WSReceiver()
    {
        WebSocketReceiveResult r = await cws.ReceiveAsync(buf, CancellationToken.None);
        res += Encoding.UTF8.GetString(buf.Array, 0, r.Count);
        // Debug.Log("GOT: " + Encoding.UTF8.GetString(buf.Array, 0, r.Count));
        if (r.EndOfMessage)
        {
            Debug.Log("END: " + res);
            if (state == "getArticles")
                GenerateArticlesInfos(res);
            else if (res.Substring(1, 9) == "_AVRSAYS:")
            {
                happyFace.SetActive(true);
                fader.FadeIn(balloon.gameObject.GetComponentInParent<CanvasGroup>());
                balloon.textToSpeech = res.Substring(1, res.Length - 2).Remove(0, 9);
                StartCoroutine(Hide(false));
            }
            else if (res.Substring(1, 9) == "_SESSION:")
            {
                HideFace(res.Substring(1, res.Length - 2).Remove(0, 9)); 
            }
            else if (res.Substring(1, 9) == "_ARTICLE:")
            {
                qtInCart += 1;
                WSGetTotal();
            }
            else if(res.Substring(2,9) == "cartPrice")
            {
                // cartPrice = res.Substring(14, 5);
            }
            res = "";
        }   
        WSReceiver();
    }

    async void WSGetArticles()
    {
        ArraySegment<byte> b = new ArraySegment<byte>(Encoding.UTF8.GetBytes("{action: getArticles}"));
        await cws.SendAsync(b, WebSocketMessageType.Text, true, CancellationToken.None);
        state = "getArticles";
    }

    async void WSGetTotal()
    {
        ArraySegment<byte> b = new ArraySegment<byte>(Encoding.UTF8.GetBytes("{action: getTotal}"));
        await cws.SendAsync(b, WebSocketMessageType.Text, true, CancellationToken.None);
    }

    public async void addToCart(string ArticleID)
    {
        Debug.Log(ArticleID);
        ArraySegment<byte> b = new ArraySegment<byte>(Encoding.UTF8.GetBytes("{ \"action\": \"addToCart\", \"articleIDs\": \"" + ArticleID + "\"}"));
        await cws.SendAsync(b, WebSocketMessageType.Text, true, CancellationToken.None);
    }

    public async void buy(bool fromUnity = true)
    {
        if (fromUnity)
        {
            ArraySegment<byte> b = new ArraySegment<byte>(Encoding.UTF8.GetBytes("{action: buy}"));
            await cws.SendAsync(b, WebSocketMessageType.Text, true, CancellationToken.None);
        }
        GameObject.FindGameObjectWithTag("Confetti").GetComponent<ParticleSystem>().Play();
        GameObject.FindGameObjectWithTag("Confetti").transform.GetChild(0).GetComponent<AudioSource>().Play();
        qtInCart = 0;
        cartPrice = "0";
    }

    private void GenerateArticlesInfos(String res)
    {
        var r = JsonHelper.fixJson(res);
        List<DBArticle> articleInfos = new List<DBArticle>(JsonHelper.FromJson<DBArticle>(r));
        foreach (GameObject article in articles)
        {
            Article articleInstance = article.GetComponent<Article>();
            DBArticle aInfo = articleInfos.Find(a => a.articleID == articleInstance.articleID);
            if (aInfo != null)
            {
                articleInstance.articleName = aInfo.name;
                articleInstance.description = aInfo.description;
                articleInstance.price = Math.Round(aInfo.price, 2);
            }
        }
        foreach (GameObject spawner in spawners)
        {
            ArticleSpawner s = spawner.GetComponent<ArticleSpawner>();
            s.okToSpawn = true;
        }
        WSResetClientState();
    }

    private void WSResetClientState()
    {
        state = "idle";
        res = "";
    }

    private void HideFace(string sesh)
    {
        if (sesh == "STARTED")
        {
            happyFace.SetActive(true); 
        }
        else if(sesh == "ENDED")
        {
            fader.FadeOut(balloon.gameObject.GetComponent<CanvasGroup>());
            happyFace.SetActive(false);
        }else if(sesh == "BOUGHT"){
            buy(false);
        }
        hintState = sesh;
    }

    private async void OnApplicationQuit()
    {
        await cws.CloseAsync(WebSocketCloseStatus.NormalClosure, "Unity quit", CancellationToken.None);
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

public static class JsonHelper
{
    public static T[] FromJson<T>(string json)
    {
        Wrapper<T> wrapper = JsonUtility.FromJson<Wrapper<T>>(json);
        return wrapper.Items;
    }

    public static string ToJson<T>(T[] array)
    {
        Wrapper<T> wrapper = new Wrapper<T>();
        wrapper.Items = array;
        return JsonUtility.ToJson(wrapper);
    }

    public static string ToJson<T>(T[] array, bool prettyPrint)
    {
        Wrapper<T> wrapper = new Wrapper<T>();
        wrapper.Items = array;
        return JsonUtility.ToJson(wrapper, prettyPrint);
    }

    [Serializable]
    private class Wrapper<T>
    {
        public T[] Items;
    }

    public static string fixJson(string value)
    {
        value = "{\"Items\":" + value + "}";
        return value;
    }
}