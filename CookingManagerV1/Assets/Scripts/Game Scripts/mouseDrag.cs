using UnityEngine;
using System.Collections;

public class mouseDrag : MonoBehaviour {

	float distance = 20;

	void OnMouseDrag () {
		Camera cam = null;

		Vector3 mousePosition = Input.mousePosition;
		mousePosition.z = distance;

		//determines which camera to use
		foreach (Camera c in Camera.allCameras) {
			if (c.gameObject.name == "CameraFront") {
				if (c.ScreenToWorldPoint (mousePosition).x < -23) {
					foreach (Camera d in Camera.allCameras) {
						if (d.gameObject.name == "CameraLeft") {
							cam = d;
							Debug.Log ("left");
						}
					}
				} else if (c.ScreenToWorldPoint (mousePosition).x > 23) {
					foreach (Camera d in Camera.allCameras) {
						if (d.gameObject.name == "CameraRight") {
							cam = d;
							Debug.Log ("right");
						}
					}
				} else {
					cam = c;
					Debug.Log ("front");
				}
		
			}
		}
			
		//set object position to mouse position based on chosen camera
		mousePosition = new Vector3 (Input.mousePosition.x, Input.mousePosition.y, distance);
		Vector3 objPosition = cam.ScreenToWorldPoint(mousePosition);

		transform.position = objPosition;
	}
}
