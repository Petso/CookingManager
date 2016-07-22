#pragma strict


function Start () {

}

function Update () {
	// if the esacepe key is pressed then exit
	if (Input.GetKeyDown(KeyCode.Escape)) {
		QuitGame();
	}

}

function QuitGame() {
	print("Bye");
	Application.Quit();
}