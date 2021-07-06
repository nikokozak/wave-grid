// -------------- UTILS --------------- //

export const range = (start, length) => 
{
	return [...Array(length).keys()].map(i => i + start);
}

export const map = (input, in_min, in_max, out_min, out_max) => 
{
	return (input - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

export const optionGetter = (params) => 
{
	return (fieldName, deflt) =>
	{
		return params.hasOwnProperty(fieldName) ? params[fieldName] : deflt;
	}
}

export const extractPercentage = (percentageString) =>
{
	return /([0-9]+)%/.exec(percentageString)[1] / 100;
}
