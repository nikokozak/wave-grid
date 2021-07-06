import { range, optionGetter } from '../utils';

export default class Wave {

	// Keeps track of created waves, cleans up waves.
	static waveRegistry = {};

	static exists(originX, originY, size) {
		return Wave.waveRegistry.hasOwnProperty(originX * originY + size);
	}

	constructor (parent, params) {

		const optionOr = optionGetter(params);

		this.index = optionOr('index', 0);

		this.originX = optionOr('originX', 0);
		this.originY = optionOr('originY', 0);

		this.size = 1;

		this.parent = parent;

		this.leftBound = this.originX - this.size;
		this.rightBound = this.originX + this.size;
		this.topBound = this.originY - this.size;
		this.bottomBound = this.originY + this.size;

		// An attempt at making this somewhat more efficient, and avoid copying too much data.
		this.coords = new Uint16Array((this.parent.cols * 2 + this.parent.rows * 2) * 2);
		this.build();

		this.cleanable = false;
	}

	build(parent)
	{
		const fullOrPartialColRange = (row) => {
			return row == this.topBound || row == this.bottomBound ?
				range(this.leftBound, this.rightBound - this.leftBound +  1) 
				: [this.leftBound, this.rightBound]; 
		}

		const isSafe = (col, row) => {
			return col < this.parent.cols && col >= 0 && row < this.parent.rows && row >= 0;
		}

		let counter = 0;

		for (let row of range(this.topBound, this.bottomBound - this.topBound + 1)) {
			for (let col of fullOrPartialColRange(row)) {
				if (isSafe(col, row)) {
					if (this.parent.armed(col, row)) {
						this.parent.getTrigger(col, row).action(); // Call trigger.
						if (!this.parent.getTrigger(col, row).repeat) {
							this.parent.disarm(col, row);
						}
					}
					this.coords[counter] = col;
					this.coords[counter + 1] = row;
					counter += 2;
				}
			}
		}

		this.coords[counter] = 1010;
	}

	*[Symbol.iterator]() {
		for (let i = 0; this.coords[i] != 1010; i += 2) {
			yield { x: this.coords[i], y: this.coords[i + 1] };
		}
	}

	update() 
	{
		this.size += 1;

		this.leftBound = this.originX - this.size;
		this.rightBound = this.originX + this.size;
		this.topBound = this.originY - this.size;
		this.bottomBound = this.originY + this.size;

		if (!this.inGrid() && !this.cleanable) {
			// Grace cycle for trash collection.
			this.cleanable = true;
		} else if (!this.inGrid() && this.cleanable) {
			this.cleanable = false;
			this.size = 0;
			this.update();
		} else {
			this.build();
		}
	}

	inGrid() {
		return !(this.leftBound < 0 && this.rightBound > this.parent.cols - 1 && this.topBound < 0 && this.bottomBound > this.parent.rows - 1);
	}

	inWave(col, row)
	{
		return ((col == this.leftBound || col == this.rightBound) && (row <= this.bottomBound || row >= this.topBound)) ||
			((row == this.bottomBound || row == this.topBound) && (col >= this.leftBound || col <= this.rightBound));
	}

	insideWave(col, row)
	{
		return row <= this.bottomBound && row >= this.topBound && col >= this.leftBound && col <= this.rightBound;
	}

}
