#pragma strict
import Phidgets;

var showInstructions : boolean;

private var motionFloor : Analog;

// the motion floor uses four air bladders, in the corners of the floor, to raise it which are enumerated as follows:
// 2 - front left		3 - front right
// 0 - back left		1 - back right


function Start () {
	// attach the phidget that controls the floor
	motionFloor = new Analog();
    motionFloor.open();
    motionFloor.waitForAttachment(1000);
    // lower the floor at start - just in case a previous program left it up
    resetFloor();
}


function Update() {
	if(Input.GetKeyDown(KeyCode.Space)){
		resetFloor();
	}
	if(Input.GetKeyDown(KeyCode.UpArrow)){
		enable();
		moveAll(10.0F);
	}
}

function OnDisable () {
	// drop the floor
    Debug.Log("resetting floor in OnDisable");
    resetFloor();
    motionFloor.close();	// if you don't close the phidget then this phidget hangs
}

function OnGUI() {
	var buttonW : int  = 150;
	var buttonH : int  = 50;

	
	if (showInstructions) {
		GUI.BeginGroup(Rect(1420,1200,400,300));
		
		GUI.Box (Rect (0,0,400,300), "Floor Controls");
	   // utility controls
		if (GUI.Button(Rect(20,20,buttonW,buttonH), "Enable")) {
			// enable the floor for use and automatically lower the floor
			enable();
			lowerFloor();
		}
		if (GUI.Button(Rect(20,80,buttonW,buttonH), "Disable")) {
			// automatically lower the floor and then disable it from use
			lowerFloor();
			disable();
		}
	   // full floor controls
		if (GUI.Button(Rect(200,20,buttonW,buttonH), "Lower")) {
			// lower the motion floor
			lowerFloor();
		}
		if (GUI.Button(Rect(200,80,buttonW,buttonH), "Raise to Half")) {
			// raise the motion floor to half
			moveAll(5.0F);
		}
		if (GUI.Button(Rect(200,140,buttonW,buttonH), "Raise to Full")) {
			// raise the motion floor to its full height
			moveAll(10.0F);
		}
		

		GUI.EndGroup();
	}
}


function enable (){
	// the air bladders have to be enabled before they can be used
	for (var i : int = 0; i < 4; i++) {
		motionFloor.outputs[i].Enabled = true;
	}
}

function disable (){
	// when done using the floor, and after it has been lowered, disable the bladders
	for (var i : int = 0; i < 4; i++) {
		motionFloor.outputs[i].Enabled = false;
	}
}

function resetFloor() {
	// lowers the floor *** for safty, should be called at the start and end of all games ***
	enable();
    lowerFloor();
    disable();
}

function getVoltage(index : int): float {
	// return the current voltage level of the provided air bladder
	return motionFloor.outputs[index].Voltage;
}

function lowerFloor (){
	// lower the floor by setting all bladders voltages to zero - should be used at the start and end of games
	for (var i : int = 0; i < 4; i++) {
		motionFloor.outputs[i].Voltage = 0.0F;
	}
}

function moveOne (index : int, voltage : float){
	// set the voltage (translates to floor height) of the provided bladder to the provided voltage
	// voltage = 0.0F is fully lowered
	// voltage = 5.0F is raised halfway
	// voltage = 10.0F is raised fully
	motionFloor.outputs[index].Voltage = voltage;
}

function moveAll (voltage : float){
	// for all four bladders set the provided voltage (translates to height) in a range of 0.0F - 10.0F
	for (var i : int = 0; i < 4; i++) {
		motionFloor.outputs[i].Voltage = voltage;
	}
}
	
function raiseFront(voltage : float) {
	// raise the bladders on the front side of the floor to the provided voltage and fully lower the bladders on the back side
	motionFloor.outputs[2].Voltage = voltage;
	motionFloor.outputs[3].Voltage = voltage;
	motionFloor.outputs[0].Voltage = 0.0F;
	motionFloor.outputs[1].Voltage = 0.0F;
}

function raiseBack(voltage : float) {
	// raise the bladders on the back side of the floor to the provided voltage and fully lower the bladders on the front side
	motionFloor.outputs[0].Voltage = voltage;
	motionFloor.outputs[1].Voltage = voltage;
	motionFloor.outputs[2].Voltage = 0.0F;
	motionFloor.outputs[3].Voltage = 0.0F;
}

function raiseRight(voltage : float) {
	// raise the bladders on the right side of the floor to the provided voltage and fully lower the bladders on the left side
	motionFloor.outputs[1].Voltage = voltage;
	motionFloor.outputs[3].Voltage = voltage;
	motionFloor.outputs[0].Voltage = 0.0F;
	motionFloor.outputs[2].Voltage = 0.0F;
}

function raiseLeft(voltage : float) {
	// raise the bladders on the left side of the floor to the provided voltage and fully lower the bladders on the right side
	motionFloor.outputs[0].Voltage = voltage;
	motionFloor.outputs[2].Voltage = voltage;
	motionFloor.outputs[1].Voltage = 0.0F;
	motionFloor.outputs[3].Voltage = 0.0F;
}


