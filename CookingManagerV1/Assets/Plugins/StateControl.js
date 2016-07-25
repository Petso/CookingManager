

function Start () {

}

function Update () {
	if (Input.GetKeyDown ("escape")) {
        Application.Quit();
    }
    
    if (Input.GetKeyDown ("q")) {
        ReceivedOSCmessage("/state Lose");
    }
}

function ReceivedOSCmessage(data:String) {
	Debug.Log(">>> " + data);
	// parse the string to get needed data elements - have to know what is comeing in 
	var elements = data.Split(" "[0]);
	var addr = elements[0];					// String - the addr that was received
	var state = elements[1];				// String - the state to change to
	Debug.Log( addr );
	Debug.Log( state );
	// check the state   -  Assuming that addr = "/state"
	switch ( state ) {
		case "Lose":
			// TODO Lose
			// start mega explosions outside of the "windows"
			// DO SOMETHING
			yield WaitForSeconds (1);
			
			break;
		case "End":
			// shutdown the application
			Application.Quit();
			break;
	}
	
		
//	var amount = int.Parse(elements[2]);	// int - the thruster level					<<=== DO WE NEED THIS????
}

