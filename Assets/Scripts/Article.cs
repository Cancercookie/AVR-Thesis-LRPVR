using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Article : MonoBehaviour
{
    // Common
    private string articleID;
    public string articleName;
    public string description;
    public float price;
    public float weight;

    // Food
    public string[] allergens;
    public string[] characteristics;

    // Clothing
    public string brand;
    // - Instance
    public enum size {XS, S, M, L, XL};
    public string color;
    

    void Start()
    {

    }

    void Update()
    {
        
    }
}
