using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ArticleSpawner : MonoBehaviour
{
    [SerializeField]
    private GameObject[] gameObjects;
    [SerializeField]
    private char[] direction;
    [SerializeField]
    private Vector3[] rotation;
    [SerializeField]
    private int[] cloneNumber;
    [SerializeField]
    private float[] gap;

    // Start is called before the first frame update
    void Start()
    {
        for(var i = 0; i < gameObjects.Length; i++)
        {
            var prefab = gameObjects[i];
            var prefabX = 0f;
            var prefabY = 0f;
            var prefabZ = 0f;
            if(direction[i] == 'x')
            {
                prefabX = 1;
            }else if(direction[i] == 'y')
            {
                prefabY = 1;
            }
            else if(direction[i] == 'z')
            {
                prefabZ = 1;
            }
            var X = 0f;
            var Y = 0f;
            var Z = 0f;
            for (int j = 1; j < cloneNumber[i]; j++)
            {
                X = prefabX * j * gap[i];
                Y = prefabY * j * gap[i];
                Z = prefabZ * j * gap[i];
                Instantiate(prefab, new Vector3(prefab.transform.position.x + X, prefab.transform.position.y + Y, prefab.transform.position.z + Z), transform.rotation * Quaternion.Euler(rotation[i]), transform);
            }
        }
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
