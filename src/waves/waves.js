import Wave from './wave';
import options from '../options';
import { optionGetter } from '../utils';

export default class Waves {

	constructor(params = {}) {
		const optionOr = optionGetter(params);	

		this.cols = optionOr('cols', 10);
		this.rows = optionOr('rows', 10);
		this.speed = optionOr('speed', 10);
		this.frameCount = 0;
		this.time = 0;

		// Keeps track of recurring waves.
		this.recurring = {};
		// Keeps track of all waves.
		this.registry = {};
		// Triggers - callbacks for specific nodes.
		this.triggers = {};
	}

	splash(col, row) 
	{
		if (!this.registry.hasOwnProperty(Waves._hash(col, row, this.time))) {
			const waveIndex = Object.keys(this.registry).length;
			if (waveIndex < options.waves.maxWaves) {
				this.registry[Waves._hash(col, row, this.time)] =
					new Wave(this, { originX: col, originY: row, index: waveIndex });
			}
			console.log(`Wave created: ${Waves._hash(col, row, this.time)}`);
		}
	}

	unsplash(col, row)
	{
		for (let wave in this.registry) {
			if (this.registry[wave].insideWave(col, row)) {
				delete this.registry[wave];
				break;
			}
		}
	}

	// Create a wave if a certain node is hit
	splash_if(col, row, repeat = true) 
	{
		this.setTrigger(col, row, () => {
			this.splash(col, row);
		}, "wave", repeat);
	}

	// Like triggers, except we keep them conceptually separate
	setListener(col, row, fn) 
	{
		this.setTrigger(col, row, fn, "listener", true);
	}

	// When a wave hits this col, row, fn gets called. 
	setTrigger(col, row, fn, type = "wave", repeat = true) 
	{
		this.triggers[Waves._triggerHash(col, row)] = {
			repeat: repeat,
			action: fn,
			type: type,
			x: col,
			y: row
		};
	}

	// Retrieve a trigger
	getTrigger(col, row) 
	{
		if (this.triggers.hasOwnProperty(Waves._triggerHash(col, row))) {
			return this.triggers[Waves._triggerHash(col, row)];
		} else {
			return null;
		}
	}

	deleteTrigger(col, row)
	{
		if (this.triggers.hasOwnProperty(Waves._triggerHash(col, row))) {
			delete this.triggers[Waves._triggerHash(col, row)];
		}
	}

	// Does a trigger exist?
	armed(col, row) 
	{
		return this.triggers.hasOwnProperty(Waves._triggerHash(col, row));
	}

	// Remove a trigger
	disarm(col, row) 
	{
		delete this.triggers[Waves._triggerHash(col, row)];
	}

	update() 
	{
		let toDelete = [];
		this.frameCount++;

		if (this.frameCount % this.speed == 0) {
			this.time++;

			for (let wave in this.registry) {
				this.registry[wave].update(this);
				if (!this.registry[wave].inGrid()) { toDelete.push(wave) };
			}

		}

		for (let wave of toDelete) {
			delete this.registry[wave];
		}
	}

	static _hash(col, row, frameCreated) 
	{
		return `${col}-${row}-${frameCreated}`;
	}

	static _triggerHash(col, row) 
	{
		return `${col}-${row}`;
	}

	*[Symbol.iterator]() 
	{
		for (let wave in this.registry) {
			yield this.registry[wave];
		}
	}
	
}

const makeOptionGrabber = (paramObject) =>
{
	return (paramName, deflt) => 
	{
		return paramObject.hasOwnProperty(paramName) ? paramObject[paramName] : deflt;
	}
}
