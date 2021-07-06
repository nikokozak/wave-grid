import P5 from 'p5'
import Waves from './waves/waves'
import options from './options'
import Screen from './screen/screen'

// -------------- HELPERS -------------- //

// Draws the background grid of '+' chars
const drawBackgroundGrid = (p5Instance, window) =>
{
	p5Instance.fill(options.colors.grid);
		for (let i = 0; i <= window.maxX; i++) {
			for (let j = 0; j <= window.maxY; j++) {
				const { x, y } = window.getCellCoords(i, j);
				p5Instance.text('+', x, y);
			}
		}
}

// Draws the different waves, labeled by index
const drawWaves = (p5Instance, window, waves) =>
{
		p5Instance.rectMode(p5Instance.CENTER);

		for (let wave of waves) {
			for (let node of wave) {
				const { x, y } = window.getCellCoords(node.x, node.y);
				p5Instance.fill(options.colors.background);
				p5Instance.square(x, y, window.cellSize);
				p5Instance.fill(options.colors.text);
				p5Instance.text(wave.index, x, y);
			}
		}
}

// Draws active triggers
const drawTriggers = (p5Instance, window, triggers) =>
{
	for (let trigger in triggers) {
		if (triggers[trigger].type == "wave") {
			drawBold(p5Instance, window, triggers[trigger].x, triggers[trigger].y, "t");		
		} else if (triggers[trigger].type == "listener") {
			drawBold(p5Instance, window, triggers[trigger].x, triggers[trigger].y, "e");		
		}
	}
}

// Draw wave cursor
const drawCursor = (p5Instance, window) =>
{
	drawBold(p5Instance, window, window.cursorX, window.cursorY, "A");
}

// Draw wave trigger
const drawBold = (p5Instance, window, col, row, text) =>
{
	const { x, y } = window.getCellCoords( col, row );
		// DRAW MOUSE CURSOR AS A
		p5Instance.fill(options.colors.text);
		p5Instance.square(x, y, window.cellSize);
		p5Instance.fill(options.colors.background);
		p5Instance.text(text, x, y);
}

// -------------- SETUP ---------------- //

const sketch = (p) => {

	const screen = new Screen(p);

	const w1 = screen.newWindow({ 
		width: '100%', 
		height: '100%', 
		cellSize: 20,
		sampleMode: 'CENTER' });

	const waves = new Waves({ cols: w1.cols, rows: w1.rows });
	waves.splash(10, 10);
	waves.splash_if(3, 4);
	waves.splash_if(15, 17);

	p.setup = () => {
		p.noStroke();
		p.createCanvas(options.size.width, options.size.height);
		p.textAlign(p.CENTER, p.CENTER);
		p.rectMode(p.CENTER);
		p.textSize(20);
	}

	p.draw = () => {

		p.rectMode(p.CORNERS);
		p.textAlign(p.CENTER, p.CENTER);
		p.background(options.colors.background);

		drawBackgroundGrid(p, w1);
		drawWaves(p, w1, waves, options);
		drawCursor(p, w1);
		drawTriggers(p, w1, waves.triggers);
		

		waves.update();

		p.keyPressed = () => 
		{
			switch (p.keyCode) {
				case 65:
					waves.splash(w1.cursorX, w1.cursorY);
					break;
				case 88:
					waves.unsplash(w1.cursorX, w1.cursorY);
					waves.deleteTrigger(w1.cursorX, w1.cursorY);
					break;
				case 69:
					waves.setListener(w1.cursorX, w1.cursorY, () => console.log("listening"));
					break;
				case 84:
					waves.splash_if(w1.cursorX, w1.cursorY);
					break;
				case p.LEFT_ARROW:
					w1.setCursor(Math.max(0, w1.cursorX - 1), w1.cursorY);
					break;
				case p.RIGHT_ARROW:
					w1.setCursor(Math.min(w1.maxX, w1.cursorX + 1), w1.cursorY);
					break;
				case p.UP_ARROW:
					w1.setCursor(w1.cursorX, Math.max(0, w1.cursorY - 1));
					break;
				case p.DOWN_ARROW:
					w1.setCursor(w1.cursorX, Math.min(w1.maxY, w1.cursorY + 1));
					break;
				default: 
					console.log(p.keyCode);
			}
		}
	}
}

const container = document.getElementById('p5');
const instance = new P5(sketch, container);
