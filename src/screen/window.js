import { optionGetter, extractPercentage } from '../utils'

export default class Window {
	
	constructor (parent, params = {} ) {
	
		// Our parameter fetcher
		const optionOr = optionGetter(params);

		// The Screen parent
		this.parent = parent;

		// Width and height are passed as percentages
		this.relWidth = extractPercentage(optionOr('width', '100%'));
		this.relHeight = extractPercentage(optionOr('height', '100%'));

		// The cellSize in pixels
		this.cellSize = optionOr('cellSize', 10);
		// Utility for centering modes
		this.halfCell = this.cellSize / 2;

		// The origin point for the window - initially top-left
		this.originX = optionOr('originX', 0);
		this.originY = optionOr('originY', 0);

		// The actual pixel width of the Window
		this.width = parent.width * this.relWidth;
		this.height = parent.height * this.relHeight;

		// The number of columns and rows according to the cell size
		this.cols = Math.floor(this.width / this.cellSize);
		this.rows = Math.floor(this.height / this.cellSize);

		// The actual maximumum number of columns and rows (useful for loops)
		this.maxX = this.cols - 1;
		this.maxY = this.rows - 1;

		// Padding around edges to accommodate for space left over after cell division
		this.colPadding = (this.width / this.cellSize - this.cols) / 2;
		this.rowPadding = (this.height / this.cellSize - this.rows) / 2;

		// Mode for sampling pixel locations (accepts "CENTER", "TOPLEFT", "TOPRIGHT", "LEFT", "RIGHT", "BOTTOMLEFT", "BOTTOMRIGHT")
		this.sampleMode = optionOr('sampleMode', "TOPLEFT");

		this.cursorX = optionOr('cursorX', 0);
		this.cursorY = optionOr('cursorY', 0);

		// Position of window cursor in pixels
		this.cursorPX = this.getCellCoords(this.cursorX, this.cursorY).x;
		this.cursorPY = this.getCellCoords(this.cursorX, this.cursorY).y;
	}

	// Retrieves cell pixel coordinates according to the sampling mode.
	getCellCoords ( col, row )
	{
		// Coordinates of top-left corner of cell.
		const baseCoords = {
			x: this.originX + this.colPadding + col * this.cellSize,
			y: this.originY + this.rowPadding + row * this.cellSize
		}

		//console.log(this.width);

		switch ( this.sampleMode )
		{
			case "TOPLEFT":
				return baseCoords;
			case "TOPRIGHT":
				baseCoords.x += this.cellSize;
				return baseCoords;
			case "LEFT":
				baseCoords.y += this.halfCell;
				return baseCoords;
			case "RIGHT":
				baseCoords.x += this.cellSize;
				baseCoords.y += this.halfCell;
				return baseCoords;
			case "BOTTOMLEFT":
				baseCoords.y += this.cellSize;
				return baseCoords;
			case "BOTTOMRIGHT":
				baseCoords.x += this.cellSize;
				baseCoords.y += this.cellSize;
				return baseCoords;
			case "CENTER":
				baseCoords.x += this.halfCell;
				baseCoords.y += this.halfCell;
				return baseCoords;
			default: 
				return baseCoords;
		}
	}

	// Set the cursor position.
	setCursor ( col, row)
	{
		this.cursorX = col;
		this.cursorY = row;

		// Position of window cursor in pixels
		this.cursorPX = this.getCellCoords(this.cursorX, this.cursorY).x;
		this.cursorPY = this.getCellCoords(this.cursorX, this.cursorY).y;

		//console.log(`${this.cursorX} - ${this.cursorY}`);
		//console.log(this.cursorPX = this.getCellCoords(this.cursorX, this.cursorY));

		return {
			x: col,
			y: row
		}
	}

	// execute a function after translating drawing world to the cursor position
	draw ( drawingFunction ) 
	{
		this.parent.p5Instance.push();
		this.parent.p5Instance.translate(this.cursorPX, this.cursorPY);
		//console.log(`${this.cursorPX} - ${this.cursorPY}`);
		drawingFunction();
		this.parent.p5Instance.pop();
	}

	// retrieve pixel extents (i.e. { x0: topleft, y0: topleft, x1: bottomright, y1: bottomright })
	getExtents ( cell0Col, cell0Row, cell1Col, cell1Row ) 
	{
		const originalSamplingMode = this.sampleMode;
		const result = {};

		this.sampleMode = "TOPLEFT";
		result.x0 = this.getCellCoords(cell0Col, cell0Row).x;
		result.y0 = this.getCellCoords(cell0Col, cell0Row).y;

		this.sampleMode = "BOTTOMRIGHT";
		result.x1 = this.getCellCoords(cell1Col, cell1Row).x;
		result.y1 = this.getCellCoords(cell1Col, cell1Row).y;

		this.sampleMode = originalSamplingMode;

		return result;
	}

}
