using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ArticleUI : MonoBehaviour
{
    private float speed = 50.0f;
    public Article article;
    public bool visible = false;
    private string URI = "ArticleUI/Canvas";
    private Canvas canvas;

    void Start()
    {
        canvas = this.GetComponentInChildren<Canvas>();
    }

    void Update()
    {
        canvas.gameObject.SetActive(visible);
    }

    public void open(Article a)
    {
        article = a;
        articlePrep();
        UIPrep();
        visible = true;
    }

    private void Spin()
    {
        article.gameObject.transform.Rotate(Vector3.right, speed * Time.deltaTime);
    }

    private void articlePrep()
    {
        //Vector3 scale = article.gameObject.transform.localScale;
        //scale.x = scale.x * 0.5f;
        //scale.y = scale.y * 0.5f;
        //scale.z = scale.z * 0.5f; ;
        //article.gameObject.transform.localScale = scale;
        //article.gameObject.GetComponent<Rigidbody>().useGravity = false;
    }

    private void UIPrep()
    {
        // MOVE UI TO ARTICLE LOCATION + OFFSET
        Text description = GameObject.FindWithTag("Description").GetComponent<Text>();
        Text price = GameObject.FindWithTag("Price").GetComponent<Text>();
        Text title = GameObject.FindWithTag("Title").GetComponent<Text>();
        ScrollRect scroll = this.GetComponentInChildren<ScrollRect>();

        scroll.verticalScrollbarVisibility = ScrollRect.ScrollbarVisibility.AutoHide;
        title.text = article.articleName;
        price.text = article.price.ToString("F") + "€";
        description.text = article.description;
    }

    public void close()
    {
        visible = false;
    }
}
