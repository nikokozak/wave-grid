import Window from './window'
import options from '../options'
import { optionGetter } from '../utils'

export default class Screen {

	constructor ( p5Instance, params = {} ) {

		// The p5 Instance, used to draw, etc.
		this.p5Instance = p5Instance;
		
		const optionOr = optionGetter(params);

		this.width = optionOr('width', options.size.width);
		this.height = optionOr('height', options.size.height);

		this.windows = {};
}

	newWindow ( params = {} ) {
		
		const currentKeys = Object.keys(this.windows).sort();
		const newIndex = currentKeys[currentKeys.length - 1] + 1;

		this.windows[newIndex] = new Window(this, params);

		return this.windows[newIndex];

	}
}
