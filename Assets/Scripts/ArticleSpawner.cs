using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ArticleSpawner : MonoBehaviour
{
    [SerializeField]
    private GameObject[] gameObjects;
    [SerializeField]
    private char[] directions;

    // Start is called before the first frame update
    void Start()
    {
        for(var i = 0; i < gameObjects.Length; i++)
        {
            var prefab = gameObjects[i];
            var prefabX = 0f;
            var prefabY = 0f;
            var prefabZ = 0f;
            if(directions[i] == 'x')
            {
                prefabX = 1;
            }else if(directions[i] == 'y')
            {
                prefabY = 1;
            }
            else if(directions[i] == 'z')
            {
                prefabZ = 1;
            }
            for (int j = 1; j <=10; j++)
            {
                prefabX = prefabX * j * 0.2f;
                prefabY = prefabY * j * 0.2f;
                prefabZ = prefabZ * j * 0.2f;
                Instantiate(prefab, new Vector3(prefab.transform.position.x + prefabX, prefab.transform.position.y + prefabY, prefab.transform.position.z + prefabZ), transform.rotation * Quaternion.Euler(0f, 0f, 90f));
            }
        }
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
