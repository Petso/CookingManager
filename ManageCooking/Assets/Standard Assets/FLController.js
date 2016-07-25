#pragma strict
import Phidgets;
import UnityEngine;
import System.Collections;
import UnityEngine.UI;
import System;

var showInstructions : boolean;

public var shakeTime:float;
private var motionFloor : Analog;
private var isRaising0 = false;
private var isRaising1 = true;
private var isRaising2 = false;
private var isRaising3 = true;
public var isStormActivated:boolean;
private var rumbleSpeed:float;

public enum FloorState
{
	Default = 0,
    RaiseLeft = 1,
    RaiseRight = 2,
    LevelUp = 3,
    LevelDown = 4,
    LevelZero = 7,
    Shake = 5,
    Rumble = 6,
    RaiseUp = 8,
    RaiseDown = 9,
}


public enum FloorSpeed
{
	Accelerate = 20,
	Tilt = 100,
	Normal = 10,
	Storm = 60,
	Shake = 50,//300 max
    Rumble = 40,
}


private var floorState :FloorState;
private var floorSpeed :FloorSpeed;

// the motion floor uses four air bladders, in the corners of the floor, to raise it which are enumerated as follows:
// 2 - front left		3 - front right
// 0 - back left		1 - back right

function Awake(){
	floorState = FloorState.LevelDown;
	
}

function Start () {

	// attach the phidget that controls the floor
	motionFloor = new Analog();
    motionFloor.open();
    motionFloor.waitForAttachment(1000);
   
    floorState = FloorState.LevelDown;
	
    // lower the floor at start - just in case a previous program left it up
    //resetFloor();
    disable();
    InvokeRepeating("updateFloor",0.0001f,0.05f);
    
}


function Update() {
	 //updateFloor();
	
	 if(Input.GetKeyDown(KeyCode.Z)){
	 	RumbleUp();
	 }
	 
	 if(Input.GetKeyDown(KeyCode.X)){
	 	RumbleDown();
	 }
	 
	 if(Input.GetKeyDown(KeyCode.S)){
	 	Shake(3);
	 }
	 
	 if(Input.GetKeyDown(KeyCode.LeftArrow)){
	 	RaiseLeft();
	 }
	 
	 if(Input.GetKeyDown(KeyCode.A)){
	 	Accelerate();
	 }
	 
	 if(Input.GetKeyDown(KeyCode.RightArrow)){
	 	RaiseRight();
	 }
	 
	 if(Input.GetKeyDown(KeyCode.UpArrow)){
	 	LevelUp();
	 	
	 }
	 
	 if(Input.GetKeyDown(KeyCode.DownArrow)){
	 	LevelDown();
	 	
	 }
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
	   	GUI.EndGroup();
	}
}

public function RaiseUp(){
	floorState = FloorState.RaiseUp;
	
}
public function RaiseDown(){
	floorState = FloorState.RaiseDown;
	
}


public function RaiseRight(){
	Debug.Log("RaiseRight");
	floorState = FloorState.RaiseRight;
	
}

public function RaiseLeft(){
	floorState = FloorState.RaiseLeft;
}

public function LevelUp(){
	floorState = FloorState.LevelUp;
}

public function LevelDown(){
	floorState = FloorState.LevelDown;
}

public function LevelZero(){
	floorState = FloorState.LevelZero;
}

public function Shake(time:float){
	if(floorState != FloorState.Shake)
	{
		floorState = FloorState.Shake;
		Invoke("LevelDown",time);
	}
	else
	{
		resetFloor();
	}
	
}

public function RumbleUp(){
	
	LevelUp();
	Invoke("LevelZero",0.35f);
	Invoke("LevelDown",0.7f);
	
}

public function RumbleDown(){
	
	LevelZero();
	Invoke("LevelDown",0.6f);
	
}

public function Accelerate(){
	Debug.Log("Accelerate");
	enable();
	RaiseUp();
	Invoke("RaiseDown",2.5f);
	Invoke("LevelDown",5f);
}


private function SetStormFlag(flag:boolean){
	isStormActivated = flag;
	Shake(2);
}

public function LevelHalf(){
	moveAll(5.0f);
}


function updateFloor(){
	var maxCutoff = ((isStormActivated == true) ? 6.5f : 9.0f);
	var minCutoff = 1.0f;
	var minVoltage = 0.0f;
	var maxVoltage = 10.0f;
	var midVoltage = 5.0f;
	var offset0 = 0.0f;
	var offset1 = 0.0f;
	var offset2 = 0.0f;
	var offset3 = 0.0f;
	
	switch(floorState)
	{
	case FloorState.RaiseUp:
		
			maxVoltage = 10.0f;
			minVoltage = 0.0f;
			floorSpeed  = FloorSpeed.Accelerate;
			
			offset1 = offset0 = -Time.deltaTime * floorSpeed.GetHashCode();
			offset2 = offset3 = (Time.deltaTime * floorSpeed.GetHashCode());
			
			moveOne(0,Mathf.Clamp((getVoltage(0) + offset0),0, 10));
			moveOne(1,Mathf.Clamp((getVoltage(1) + offset1),0, 10));
			moveOne(2,Mathf.Clamp((getVoltage(2) + offset2),0, 10));
			moveOne(3,Mathf.Clamp((getVoltage(3) + offset3),0, 10));
			
		break;
		case FloorState.RaiseDown:
				
			maxVoltage = 10.0f;
			minVoltage = 0.0f;
			floorSpeed  = FloorSpeed.Accelerate;
			
			offset1 = offset0 = Time.deltaTime * floorSpeed.GetHashCode();
			offset2 = offset3 = (Time.deltaTime * floorSpeed.GetHashCode());
			
			moveOne(0,Mathf.Clamp((getVoltage(0) + offset0),0, 5));
			moveOne(1,Mathf.Clamp((getVoltage(1) + offset1),0, 5));
			moveOne(2,Mathf.Clamp((getVoltage(2) + offset2),0, 5));
			moveOne(3,Mathf.Clamp((getVoltage(3) + offset3),0, 5));
		
		break;
		case FloorState.RaiseLeft:
			
			maxVoltage = 10.0f;
			minVoltage = 0.0f;
			if(getVoltage(0) < maxCutoff || getVoltage(2) < maxCutoff){
				moveOne(0,maxCutoff);
				moveOne(2,maxCutoff);
			}
			if(getVoltage(1) > minCutoff || getVoltage(3) > minCutoff){
				moveOne(1,minCutoff);
				moveOne(3,minCutoff);
			}
				
			floorSpeed  = FloorSpeed.Tilt;
		
			if(isRaising0 == true && getVoltage(0) >= maxVoltage){ isRaising0 = false;}
			if(isRaising0 == false && getVoltage(0) <= maxCutoff){ isRaising0 = true;}
			
			isRaising2 = isRaising0;
			
			if(isRaising3 == true && getVoltage(3) >= minCutoff){ isRaising3 = false;}
			if(isRaising3 == false && getVoltage(3) <= minVoltage){ isRaising3 = true;}
			
			isRaising1 = isRaising3;
			
			offset0 = (isRaising0 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
			offset1 = (isRaising1 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
			offset2 = (isRaising2 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
			offset3 = (isRaising3 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
			
			moveOne(0,Mathf.Clamp((getVoltage(0) + offset0),0, 10));
			moveOne(1,Mathf.Clamp((getVoltage(1) + offset1),0, 10));
			moveOne(2,Mathf.Clamp((getVoltage(2) + offset2),0, 10));
			moveOne(3,Mathf.Clamp((getVoltage(3) + offset3),0, 10));
			
			
		break;
		case FloorState.RaiseRight:
		
			maxVoltage = 10.0f;
			minVoltage = 0.0f;
			if(getVoltage(1) < maxCutoff || getVoltage(3) < maxCutoff){
				moveOne(1,maxCutoff);
				moveOne(3,maxCutoff);
			}
			if(getVoltage(0) > minCutoff || getVoltage(2) > minCutoff){
				moveOne(0,minCutoff);
				moveOne(2,minCutoff);
			}
				
			floorSpeed  = FloorSpeed.Tilt;
		
			if(isRaising1 == true && getVoltage(1) >= maxVoltage){ isRaising1 = false;}
			if(isRaising1 == false && getVoltage(1) <= maxCutoff){ isRaising1 = true;}
			
			isRaising3 = isRaising1;
			
			if(isRaising0 == true && getVoltage(0) >= minCutoff){ isRaising0 = false;}
			if(isRaising0 == false && getVoltage(0) <= minVoltage){ isRaising0 = true;}
			
			isRaising2 = isRaising0;
			
			offset0 = (isRaising0 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
			offset1 = (isRaising1 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
			offset2 = (isRaising2 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
			offset3 = (isRaising3 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
			
			moveOne(0,Mathf.Clamp((getVoltage(0) + offset0),0, 10));
			moveOne(1,Mathf.Clamp((getVoltage(1) + offset1),0, 10));
			moveOne(2,Mathf.Clamp((getVoltage(2) + offset2),0, 10));
			moveOne(3,Mathf.Clamp((getVoltage(3) + offset3),0, 10));
		
				
		break;
		case FloorState.LevelUp:
			
			maxVoltage = 10.0f;
			minVoltage = 0.0f;
			floorSpeed  = FloorSpeed.Tilt;
			
			offset1 = offset0 = Time.deltaTime * floorSpeed.GetHashCode();
			offset2 = offset3 = (Time.deltaTime * floorSpeed.GetHashCode());
			
			moveOne(0,Mathf.Clamp((getVoltage(0) + offset0),0, 10));
			moveOne(1,Mathf.Clamp((getVoltage(1) + offset1),0, 10));
			moveOne(2,Mathf.Clamp((getVoltage(2) + offset2),0, 10));
			moveOne(3,Mathf.Clamp((getVoltage(3) + offset3),0, 10));
			
		break;
		
		case FloorState.LevelZero:
			
			maxVoltage = 10.0f;
			minVoltage = 0.0f;
			floorSpeed  = FloorSpeed.Tilt;
			
			offset1 = offset0 = -(Time.deltaTime * floorSpeed.GetHashCode());
			offset2 = offset3 = -(Time.deltaTime * floorSpeed.GetHashCode());
			
			moveOne(0,Mathf.Clamp((getVoltage(0) + offset0),3, 10));
			moveOne(1,Mathf.Clamp((getVoltage(1) + offset1),3, 10));
			moveOne(2,Mathf.Clamp((getVoltage(2) + offset2),3, 10));
			moveOne(3,Mathf.Clamp((getVoltage(3) + offset3),3, 10));
			
		break;
		
		case FloorState.Shake:
			
			var shakeSpeed = FloorSpeed.Shake.GetHashCode();
			
			if(isRaising1 == true && getVoltage(1) >= 10.0f){ isRaising1 = false;}
			if(isRaising1 == false && getVoltage(1) <= 0.0f){ isRaising1 = true;}
			
			if(isRaising2 == true && getVoltage(2) >= 10.0f){ isRaising2 = false;}
			if(isRaising2 == false && getVoltage(2) <= 0.0f){ isRaising2 = true;}
			
			isRaising0 = isRaising3 = !isRaising1;
			
			offset0 = (isRaising0 == true) ? Time.deltaTime * shakeSpeed : -(Time.deltaTime * shakeSpeed);
			offset1 = (isRaising1 == true) ? Time.deltaTime * shakeSpeed : -(Time.deltaTime * shakeSpeed);
			offset2 = (isRaising2 == true) ? Time.deltaTime * shakeSpeed : -(Time.deltaTime * shakeSpeed);
			offset3 = (isRaising3 == true) ? Time.deltaTime * shakeSpeed : -(Time.deltaTime * shakeSpeed);
			
			moveOne(0,Mathf.Clamp((getVoltage(0) + offset0),0.0f, 10.0f));
			moveOne(1,Mathf.Clamp((getVoltage(1) + offset1),0.0f, 10.0f));
			moveOne(2,Mathf.Clamp((getVoltage(2) + offset2),0.0f, 10.0f));
			moveOne(3,Mathf.Clamp((getVoltage(3) + offset3),0.0f, 10.0f));
			
		break;
		case FloorState.Rumble:
			minVoltage = 2.49f;
			maxVoltage = 7.49f;
			if(isRaising0 == true && getVoltage(0) > maxVoltage){ isRaising0 = false;}
			if(isRaising0 == false && getVoltage(0) < minVoltage){ isRaising0 = true;}
			
			
			isRaising2 = isRaising0;
			isRaising3 = isRaising1 = !isRaising0;
			
			offset0 = (isRaising0 == true) ? Time.deltaTime * rumbleSpeed : -(Time.deltaTime * rumbleSpeed);
			offset1 = (isRaising1 == true) ? Time.deltaTime * rumbleSpeed : -(Time.deltaTime * rumbleSpeed);
			offset2 = (isRaising2 == true) ? Time.deltaTime * rumbleSpeed : -(Time.deltaTime * rumbleSpeed);
			offset3 = (isRaising3 == true) ? Time.deltaTime * rumbleSpeed : -(Time.deltaTime * rumbleSpeed);
			
			
			
			moveOne(0,Mathf.Clamp((getVoltage(0) + offset0),0, 10));
			moveOne(1,Mathf.Clamp((getVoltage(1) + offset1),0, 10));
			moveOne(2,Mathf.Clamp((getVoltage(2) + offset2),0, 10));
			moveOne(3,Mathf.Clamp((getVoltage(3) + offset3),0, 10));
			print("vLeft: "+getVoltage(0)+", "+getVoltage(2)+" vRight: "+getVoltage(1)+", "+getVoltage(3)+ ", offset:"+ Time.deltaTime * rumbleSpeed);
		
			
		break;
			
		case FloorState.Default:
		case FloorState.LevelDown:
			
			if(isStormActivated == true)
			{
				//minVoltage = 2.5f;
				//maxVoltage = 5.8f;
				
				floorSpeed = FloorSpeed.Storm.GetHashCode();
			
				if(isRaising1 == true && getVoltage(1) >= 6.0f){ isRaising1 = false;}
				if(isRaising1 == false && getVoltage(1) <= 4.5f){ isRaising1 = true;}
				
				if(isRaising2 == true && getVoltage(2) >= 4.5f){ isRaising2 = false;}
				if(isRaising2 == false && getVoltage(2) <= 6.0f){ isRaising2 = true;}
				
				isRaising0 = isRaising3 = !isRaising1;
				
				offset0 = (isRaising0 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
				offset1 = (isRaising1 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
				offset2 = (isRaising2 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
				offset3 = (isRaising3 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
				
				moveOne(0,Mathf.Clamp((getVoltage(0) + offset0),2.0f, 8f));
				moveOne(1,Mathf.Clamp((getVoltage(1) + offset1),2.0f, 8f));
				moveOne(2,Mathf.Clamp((getVoltage(2) + offset2),2.0f, 8f));
				moveOne(3,Mathf.Clamp((getVoltage(3) + offset3),2.0f, 8f));
			}
			else
			{
			
				minVoltage = 4f;
				maxVoltage = 5.8f;
				
				floorSpeed = FloorSpeed.Normal;
				
				if(isRaising0 == true && getVoltage(0) >= maxVoltage){ isRaising0 = false;}
				if(isRaising0 == false && getVoltage(0) <= minVoltage){ isRaising0 = true;}
				
				
				offset0 = (isRaising0 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
				offset2 = offset0 = Mathf.Clamp((getVoltage(0) + offset0),0, 10);
				
				if(offset0 < midVoltage){
					offset3 = offset1 = midVoltage + (midVoltage - offset0);
				}
				else{
					offset3 = offset1 = midVoltage - (offset0 - midVoltage);
			
				}
				
				moveOne(0,Mathf.Clamp(offset0,0, 10));
				moveOne(1,Mathf.Clamp(offset1,0, 10));
				moveOne(2,Mathf.Clamp(offset2,0, 10));
				moveOne(3,Mathf.Clamp(offset3,0, 10));
				
				//print("vLeft: "+getVoltage(0)+", "+getVoltage(2)+" vRight: "+getVoltage(1)+", "+getVoltage(3));
				/*
				floorSpeed = FloorSpeed.Normal.GetHashCode();
			
				if(isRaising1 == true && getVoltage(1) >= 6.0f){ isRaising1 = false;}
				if(isRaising1 == false && getVoltage(1) <= 4.5f){ isRaising1 = true;}
				
				if(isRaising2 == true && getVoltage(2) >= 4.5f){ isRaising2 = false;}
				if(isRaising2 == false && getVoltage(2) <= 6.0f){ isRaising2 = true;}
				
				isRaising0 = isRaising3 = !isRaising1;
				
				offset0 = (isRaising0 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
				offset1 = (isRaising1 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
				offset2 = (isRaising2 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
				offset3 = (isRaising3 == true) ? Time.deltaTime * floorSpeed.GetHashCode() : -(Time.deltaTime * floorSpeed.GetHashCode());
				
				moveOne(0,Mathf.Clamp((getVoltage(0) + offset0),4.0f, 7f));
				moveOne(1,Mathf.Clamp((getVoltage(1) + offset1),4.0f, 7f));
				moveOne(2,Mathf.Clamp((getVoltage(2) + offset2),4.0f, 7f));
				moveOne(3,Mathf.Clamp((getVoltage(3) + offset3),4.0f, 7f));
				
				*/
			}
			
						
		break;
	
	}

}



function OnDisable () {
	// drop the floor
    Debug.Log("resetting floor in OnDisable");

    resetFloor();
    motionFloor.close();	// if you don't close the phidget then this phidget hangs
	
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
	floorState = FloorState.Default;
    floorSpeed = FloorSpeed.Normal;
	enable();
    lowerFloor();
   
}

private function getVoltage(index : int): float {
	// return the current voltage level of the provided air bladder
	return motionFloor.outputs[index].Voltage;
}

function lowerFloor (){
	// lower the floor by setting all bladders voltages to zero - should be used at the start and end of games
	for (var i : int = 0; i < 4; i++) {
		motionFloor.outputs[i].Voltage = 0.0F;
	}
}

private function moveOne (index : int, voltage : float){
	// set the voltage (translates to floor height) of the provided bladder to the provided voltage
	// voltage = 0.0F is fully lowered
	// voltage = 5.0F is raised halfway
	// voltage = 10.0F is raised fully
	motionFloor.outputs[index].Voltage = voltage;
}

private function moveAll (voltage : float){
	// for all four bladders set the provided voltage (translates to height) in a range of 0.0F - 10.0F
	for (var i : int = 0; i < 4; i++) {
		motionFloor.outputs[i].Voltage = voltage;
	}
}
	
