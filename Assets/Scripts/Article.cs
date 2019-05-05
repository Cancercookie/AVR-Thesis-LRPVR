using UnityEngine;

public class Article : MonoBehaviour
{
    // Common
    [SerializeField]
    public string articleID;
    public string articleName;
    public string description;
    public double price;
    public float weight;

    // Food
    public string[] allergens;
    public string[] characteristics;

    // Clothing
    public string brand;
    // - Instance
    public enum size {XS, S, M, L, XL};
    public size Size;
    public string color;
    private ArticleUI articleUI;

    void Awake()
    {
        getInfoFromDB();
    }

    void Start()
    {

    }

    void spawnUI()
    {
       // articleUI.transform.localPosition 
    }

    void getInfoFromDB()
    {

    }
}
