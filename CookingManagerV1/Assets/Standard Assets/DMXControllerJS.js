	
	/*
	JS Controller that sends all the messages to OSCMain. 
	Check the Lighting OSC Messages.txt documentation to fully understand each function
	*/
	
	private var osc : GameObject;
	private var whichLight : String;

	function Awake () {
		osc = GameObject.Find("OSCMain");
	}

	function Update () {
	}

	public function Blackout () {
		osc.SendMessage("SendOSCMessage","/lighting operations blackout");
	}

	public function AllOn() {
		osc.SendMessage("SendOSCMessage","/lighting operations allOn");
	}

	public function TurnOn(lightName, red: int, green: int, blue: int, amber: int, dimmer: int) {
		osc.SendMessage("SendOSCMessage","/lighting color " + lightName + " "+red+" "+green+" "+blue+" "+amber+" "+dimmer);
	}

	public function TurnOn(lightName, thisColor: Color32, amber: int, dimmer: int) {
		osc.SendMessage("SendOSCMessage","/lighting color " + lightName + " "+thisColor.r+" "+thisColor.g+" "+thisColor.b+" "+amber+" "+dimmer);
	}

	public function TurnOn(lightName, thisColor: Color, amber: int, dimmer: int) {
		osc.SendMessage("SendOSCMessage","/lighting color " + lightName + " "+thisColor.r*255+" "+thisColor.g*255+" "+thisColor.b*255+" "+amber+" "+dimmer);
	}

	public function TurnOff(lightName) {
		osc.SendMessage("SendOSCMessage","/lighting color " + lightName + " 0 0 0 0 0");
	}
	
	public function MoveVulture (pan: int, tilt: int, finePan: int, fineTilt: int) {
		osc.SendMessage("SendOSCMessage","/lighting move vulture "+pan+" "+tilt+" "+finePan+" "+fineTilt);
	}
	
	public function TurnOnWaterLight(thisColor: int, rotation: int, dimmer: int) {
		osc.SendMessage("SendOSCMessage","/lighting color h20 "+thisColor+" "+rotation+" 0 0 "+dimmer);
	}	
	
	public function TurnOnUVLight(dimmer: int) {
		osc.SendMessage("SendOSCMessage","/lighting color uv 0 0 0 0 " + dimmer);
	}
	
	public function SetMode(lightName, mode, range: int) {
		osc.SendMessage("SendOSCMessage","/lighting mode " + lightName + " "+mode+" "+range);
	}
	
	public function TurnOnCeilingLights(code) {
		osc.SendMessage("SendOSCMessage","/lighting operations ceiling " + code);
	}
	
	public function UseCue(cueName, func) {
		osc.SendMessage("SendOSCMessage","/lighting cue " + cueName + func + "1.0");
	}
	
	public function UseShow(showName) {
		osc.SendMessage("SendOSCMessage","/lighting show " + showName);
	}

