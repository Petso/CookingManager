using UnityEngine;
using System.Collections;

public class BurgerStacking : MonoBehaviour {

	// Use this for initialization
	void Start () {
	}

	void OnCollisionEnter(Collision col){
		if (col.gameObject.tag == "burger") {
			col.gameObject.transform.position = new Vector3 (gameObject.transform.position.x, 
				gameObject.transform.position.y + gameObject.GetComponent<Collider>().bounds.size.y/2 + col.gameObject.GetComponent<Collider>().bounds.size.y/2, 
				gameObject.transform.position.z);

			//set parent to plate
			if (gameObject.transform.parent == null) {
				col.gameObject.transform.SetParent (gameObject.transform);
			} else {
				col.gameObject.transform.SetParent (gameObject.transform.parent.transform);
			}

			col.gameObject.AddComponent<BurgerStacking> ();
			Destroy (col.gameObject.GetComponent<Rigidbody> ());

		}
	}


	// Update is called once per frame
	void Update () {
	}
}
