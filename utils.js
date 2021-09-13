const id = document.getElementById.bind(document)
const el = document.createElement.bind(document)

function rand(min, max)
{
	return Math.random() * (max - min) + min
}

function randInt(min, max)
{
	return Math.floor(Math.random() * (max - min) + min)
}

function randBool(trueProb)
{
	if (typeof(trueProb) === "number")
		return Math.random() < trueProb
	return Math.random() < 0.5
}

function randDate(start, end)
{
	const startTime = start.getTime()
	return new Date(startTime + Math.random() * (end.getTime() - startTime));
}

function randValue(array)
{
	return array[randInt(0, array.length)]
}

function humanize(str)
{
	return str
		.split(" ")
		.map(part => part[0].toUpperCase() + part.substr(1, part.length).toLowerCase())
		.join(" ")
}