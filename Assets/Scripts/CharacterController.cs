using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CharacterController : MonoBehaviour
{
    [SerializeField]
    private float speed = 50.0f;
    // Start is called before the first frame update
    void Start()
    {
        transform.position = new Vector3(321, 2, -90);
    }

    // Update is called once per frame
    void Update()
    {
        float horizontalInput = Input.GetAxis("Horizontal");
        float verticalInput = Input.GetAxis("Vertical");
        transform.Translate(Vector3.right * speed * horizontalInput * Time.deltaTime);
        transform.Translate(Vector3.forward * speed * verticalInput * Time.deltaTime);
    }
}
