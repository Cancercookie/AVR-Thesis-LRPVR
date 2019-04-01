using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ArticleSpawner : MonoBehaviour
{
    [SerializeField]
    public GameObject prefab;

    // Start is called before the first frame update
    void Start()
    {
        for (int i = 1; i < 5; i++){
           Instantiate(prefab, new Vector3(prefab.transform.position.x, prefab.transform.position.y, prefab.transform.position.z + i * 0.5f), Quaternion.identity);
        }  
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
