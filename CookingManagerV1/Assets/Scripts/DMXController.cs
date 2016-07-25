using UnityEngine;
using System.Collections;

public class DMXController : MonoBehaviour
{
		/*
		 C# Interface for the JS controller DMXControllerJS.js
	 	*/
		private static DMXController _instance;
		private DMXControllerJS JSController;
		public static DMXController Lighting {
				get {
						if (_instance == null)
								_instance = GameObject.FindObjectOfType<DMXController> ();
						return _instance;
				}
		}

		void Awake ()
		{
				JSController = this.GetComponent<DMXControllerJS> ();
		}

		void Start ()
		{
				//Blackout ();
				Invoke ("Blackout", 1);	// need to give the networking time to connect
		}

		void OnDisable ()
		{

		}

		void Update () 
		{
			// if the esacepe key is pressed then player is exiting - quick, send a message to the lighting manager 
			if (Input.GetKeyDown (KeyCode.Escape)) {
				UseShow ("theme");	// start up the theme lighting again
			}
		}
		
		public void Blackout ()
		{
				JSController.Blackout ();
		}
	
		public void AllOn ()
		{
				JSController.AllOn ();
		}
	
		public void TurnOn (string lightName, int red, int green, int  blue, int amber, int dimmer)
		{
				JSController.TurnOn (lightName, red, green, blue, amber, dimmer);
		}
	
		public void TurnOn (string lightName, Color32 thisColor, int amber, int dimmer)
		{
				JSController.TurnOn (lightName, thisColor, amber, dimmer);
		}
	
		public void TurnOn (string lightName, Color thisColor, int amber, int dimmer)
		{
				JSController.TurnOn (lightName, thisColor, amber, dimmer);
		}

		public void TurnOff (string lightName)
		{
				JSController.TurnOff (lightName);
		}

		public void MoveVulture (int pan, int tilt, int finePan, int fineTilt)
		{
				JSController.MoveVulture (pan, tilt, finePan, fineTilt);
		}

		/*------------------The methods below have not been tested--------------------------*/
	
		/*thisColor is an integer from 0-255 with ranges that cover about 5 Colors. */
		public void TurnOnWaterLight (int thisColor, int rotation, int dimmer)
		{
				JSController.TurnOnWaterLight (thisColor, rotation, dimmer);
		}

		public void TurnOnUVLight (int dimmer)
		{
				JSController.TurnOnUVLight (dimmer);
		}

		/*Every light has different modes. Please reference the physical documentation to see what's available.
	ccspeed is the speed that the colors will change.
	strobe sets the lights to flashing.
	macro is a preset arrangement of colors that the light will go through.
	*/
		public void SetMode (string lightName, string mode, int range)
		{
				JSController.SetMode (lightName, mode, range);
		}
	
		public void TurnOnCeilingLights (string code)
		{
				JSController.TurnOnCeilingLights (code);
		}

		public void UseCue (string cueName, string func)
		{
				JSController.UseCue (cueName, func);
		}

		public void UseShow (string showName)
		{
				JSController.UseShow (showName);
		}
}
