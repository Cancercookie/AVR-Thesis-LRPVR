using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ShelvesSpawner : MonoBehaviour
{
    [SerializeField]
    private GameObject shelf;
    private bool spawned = false;
    private List<GameObject> row;
    public bool firstShelfOk = false;
    
    void Update()
    {
        if(!spawned && firstShelfOk)
        {
            row.Add(GameObject.Instantiate(shelf, new Vector3(shelf.transform.position.x + 20, shelf.transform.position.y + 20, shelf.transform.position.z + 20), Quaternion.identity));
            spawned = true;
            firstShelfOk = false;
        }
            
    }
}
