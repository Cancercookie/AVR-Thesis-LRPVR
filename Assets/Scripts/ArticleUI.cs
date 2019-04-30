using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ArticleUI : MonoBehaviour
{
    private float speed = 50.0f;
    public Article article;
    public bool visible = true;
    public bool working = false;
    public bool allPrepped = false;
    private string URI = "ArticleUI/Canvas";

    void Start()
    {
        startPrep(); 
    }

    void Update()
    {
        if (visible)
        {
            if (!working)
            {
                startPrep();    
            }
            Spin();
        }
        else
        {
            GameObject.DestroyImmediate(this);
        }

    }

    //costructor?
    //public ArticleUI() { }

    private void Spin()
    {
        GameObject.Find(URI + "/Focus/Pasta").transform.Rotate(Vector3.right, speed * Time.deltaTime);
    }

    private void articlePrep()
    {
        Vector3 scale = GameObject.Find(URI + "/Focus/Pasta").transform.localScale;
        scale.x = scale.x * 0.5f;
        scale.y = scale.y * 0.5f;
        scale.z = scale.z * 0.5f; ;
        GameObject.Find(URI + "/Focus/Pasta").transform.localScale = scale;
        GameObject.Find(URI + "/Focus/Pasta").GetComponent<Rigidbody>().useGravity = false;
    }

    private void UIPrep()
    {
        article = GameObject.Find(URI + "/Focus/Pasta").GetComponent<Article>();
        Canvas canvas = this.GetComponentInChildren<Canvas>();
        ScrollRect scroll = this.GetComponentInChildren<ScrollRect>();
        scroll.verticalScrollbarVisibility = ScrollRect.ScrollbarVisibility.AutoHide;
        Text title = GameObject.FindWithTag("Title").GetComponent<Text>();
        title.text = article.articleName;
        Text price = GameObject.FindWithTag("Price").GetComponent<Text>();
        price.text = article.price.ToString("F") + "€";
        Text description = GameObject.FindWithTag("Description").GetComponent<Text>();
        description.text = article.description;
    }

    void close()
    {
        allPrepped = false;
    }

    public void toggleVisibility()
    {
        visible = !visible;
    }

    private void startPrep()
    {
        if (visible)
        {
            working = true;
            articlePrep();
            UIPrep();
            allPrepped = true;
            working = false;
        }
    }
}
