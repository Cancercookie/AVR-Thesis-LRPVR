using UnityEngine;

public class ArticleSpawner : MonoBehaviour
{
    public bool okToSpawn = false;
    [SerializeField]
    private GameObject[] gameObjects;
    [SerializeField]
    private char[] directions;
    [SerializeField]
    private Vector3[] rotations;
    [SerializeField]
    private int[] cloneNumber;

    private void Update()
    {
        if (okToSpawn)
        {
            for (var i = 0; i < gameObjects.Length; i++)
            {
                var prefab = gameObjects[i];
                var prefabX = 0f;
                var prefabY = 0f;
                var prefabZ = 0f;
                if (directions[i] == 'x')
                {
                    prefabX = -1;
                }
                else if (directions[i] == 'y')
                {
                    prefabY = 1;
                }
                else if (directions[i] == 'z')
                {
                    prefabZ = 1;
                }
                var X = 0f;
                var Y = 0f;
                var Z = 0f;
                for (int j = 1; j < cloneNumber[i]; j++)
                {
                    X = prefabX * j * 0f;
                    Y = prefabY * j * 0f;
                    Z = prefabZ * j * 0f;
                    Instantiate(prefab, new Vector3(prefab.transform.position.x + X, prefab.transform.position.y + Y, prefab.transform.position.z + Z), transform.rotation * Quaternion.Euler(rotations[i]), transform);
                }
            }
        }
        okToSpawn = false;
    }

}
