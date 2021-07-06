const options = {};

options.waves = {
	maxWaves: 6,
}

// Size of the sketch
options.size = {
	width: 800,
	height: 500
}

// Options pertaining to the draw grid.
options.grid = {
	width: 500,
	height: 500,
	centerX: options.size.width/2,
	centerY: options.size.height/2,
	numX: 20,
	numY: 20
}

options.colors = {
	background: 250,
	text: 30,
	grid: 170,
}

options.cursor = {
	initialTileX: 10,
	initialTileY: 10,
}

options.text = {
	textSize: 20,
	subHeaderTextSize: 15,
	menuTextSize: 20,
	menuVerticalSpacing: 25,
	menuLeftAlign: 510,
}

export default options;
