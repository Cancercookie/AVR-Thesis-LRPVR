﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Net.WebSockets;
using UnityEngine;

public class websockets : MonoBehaviour
{
    readonly Uri u = new Uri("wss://cxr4c7tqeh.execute-api.eu-west-1.amazonaws.com/production");
    private ClientWebSocket cws = null;
    private ArraySegment<byte> buf = new ArraySegment<byte>(new byte[1024]);

    private string res = "";
    private GameObject[] spawners;
    private GameObject[] articles;
    private List<DBArticle> articleInfos = new List<DBArticle>();
    
    
    private void Awake()
    {
        spawners = GameObject.FindGameObjectsWithTag("Spawner");
        articles = GameObject.FindGameObjectsWithTag("Article");
        Connect();
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

    async void WSGetArticles()
    {
        ArraySegment<byte> b = new ArraySegment<byte>(Encoding.UTF8.GetBytes("{action: getArticles}"));
        await cws.SendAsync(b, WebSocketMessageType.Text, true, CancellationToken.None);
    }
    
    async void WSReceiver()
    {
        WebSocketReceiveResult r = await cws.ReceiveAsync(buf, CancellationToken.None);
        res += Encoding.UTF8.GetString(buf.Array, 0, r.Count);
        Debug.Log("Got: " + Encoding.UTF8.GetString(buf.Array, 0, r.Count));
        if (r.EndOfMessage)
        {
            articleInfos = GenerateArticlesInfos();
            foreach (GameObject article in articles)
            {
                Article articleInstance = article.GetComponent<Article>();
                DBArticle aInfo = articleInfos.Find(a => a.articleID == articleInstance.articleID);
                if (aInfo != null)
                {
                    articleInstance.articleName = aInfo.name;
                    articleInstance.description = aInfo.description;
                    articleInstance.price = aInfo.price;
                }
            }
            foreach (GameObject spawner in spawners)
            {
                ArticleSpawner s = spawner.GetComponent<ArticleSpawner>();
                s.okToSpawn = true;
            }
        }
        WSReceiver();
    }

    private List<DBArticle> GenerateArticlesInfos()
    {
        res = JsonHelper.fixJson(res);
        List<DBArticle> json = new List<DBArticle>(JsonHelper.FromJson<DBArticle>(res));
        return json;
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