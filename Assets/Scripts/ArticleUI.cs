using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ArticleUI : MonoBehaviour
{
    private float speed = 50.0f;
    private Article article;
    private string URI = "ArticleUI/ArticleCanvas/ArticleFocus";
    // Start is called before the first frame update
    void Start()
    {
        articlePrep();
        UIPrep();
    }

    // Update is called once per frame
    void Update()
    {
        Spin();
    }

    void Spin()
    {
        GameObject.Find(URI + "/Pasta").transform.Rotate(Vector3.right, speed * Time.deltaTime);
    }

    void articlePrep()
    {
        Vector3 scale = GameObject.Find(URI + "/Pasta").transform.localScale;
        scale.x = scale.x * 0.5f;
        scale.y = scale.y * 0.5f;
        scale.z = scale.z * 0.5f; ;
        GameObject.Find(URI + "/Pasta").transform.localScale = scale;
    }

    void UIPrep()
    {
        article = GameObject.Find(URI + "/Pasta").GetComponent<Article>();
        Canvas canvas = this.GetComponentInChildren<Canvas>();
        Text title = GameObject.FindWithTag("Title").GetComponent<Text>();
        title.text = article.articleName;
        Text price = GameObject.FindWithTag("Price").GetComponent<Text>();
        price.text = article.price.ToString("F") + "€";
        Text description = GameObject.FindWithTag("Description").GetComponent<Text>();
        description.text = article.description;
        Debug.Log("Here is: " + canvas);
    }
}
