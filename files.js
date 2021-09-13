/*

tree = [
	{ // Node
		name: string // Nom du noeud
		size: int // En octet ?
		type: enum // Juste pour les fichiers
		value: int // Combien la data se vend
		children: tree [ {Node}, {Node}, ... ]
	}
]

*/

let nodeIdCounter = 0

function getNodeId()
{
	return nodeIdCounter++
}

function randName()
{
	const length = randInt(3, 10)
	let name = ""
	for (let i = 0; i < length; i++)
		name += String.fromCharCode(randInt("a".charCodeAt(0), "z".charCodeAt(0)))
	return name
}

function randDateFileName()
{
	// 1 january 2000 00:00:00
	const date = randDate(new Date(946684800000), new Date())
	return date.toLocaleDateString().replace(/(.+)\/(.+)\/(.+)/, "$3-$2-$1")
}

function getMediaName()
{
	let name = randBool() ? randomName("sentence") : randDateFileName()
	name = randBool() ? name : humanize(name)
	return name
}

function getSizeValue(minSize, maxSize, minValue, maxValue)
{
	const size = rand(minSize, maxSize)
	const value = randInt(minValue, maxValue) * ((size - minSize) / (maxSize - minSize) + 0.5)
	return { size, value }

}

const valueKeywords = {
	"id": 2,
	"password": 10,
	"contact": 3,
	"bank": 3,
	"contract": 4,
	"invoice": 4
}

function keywordMultiplier(name)
{
	const value = Object.keys(valueKeywords).find(kw => name.includes(kw))
	if (value !== undefined)
		return valueKeywords[value]
	return 1
}

const NodeGenerators = {
	Picture: ctx => {
		const name = getMediaName()
		const sizeValue = getSizeValue(5, 15, 50, 100)
		return {
			id: getNodeId(),
			name: name + `.${randValue(["jpg", "png", "gif"])}`,
			size: fileSize(sizeValue.size, SizeUnit.MO),
			type: FileType.PICTURE,
			value: sizeValue.value * ctx.valueMultiplier * keywordMultiplier(name)
		}
	},
	Video: ctx => {
		const name = getMediaName()
		const sizeValue = getSizeValue(50, 1500, 100, 1000)
		return {
			id: getNodeId(),
			name: name + `.${randValue(["mp4", "avi", "mov"])}`,
			size: fileSize(sizeValue.size, SizeUnit.MO),
			type: FileType.VIDEO,
			value: sizeValue.value * ctx.valueMultiplier * keywordMultiplier(name)
		}
	},
	WorkVideo: ctx => {
		const name = randomName("work")
		const sizeValue = getSizeValue(1, 20, 1000, 10000)
		return {
			id: getNodeId(),
			name: name + `.${randValue(["mp4", "avi", "mov"])}`,
			size: fileSize(sizeValue.size, SizeUnit.GO),
			type: FileType.VIDEO,
			value: sizeValue.value * ctx.valueMultiplier * keywordMultiplier(name)
		}
	},
	Critical: ctx => {
		const name = randomName("critical")
		const sizeValue = getSizeValue(50, 1500, 100000, 1000000)
		if (randBool(0.1))
			sizeValue.value *= 10
		return {
			id: getNodeId(),
			name: name + `.${randValue([ "db", "dat", "sql" ])}`,
			size: fileSize(sizeValue.size, SizeUnit.GO),
			type: FileType.PROTECTED,
			value: sizeValue.value * ctx.valueMultiplier * keywordMultiplier(name)
		}
	},
	Code: ctx => {
		const sizeValue = getSizeValue(1, 20, 1000, 10000)
		if (randBool(0.05))
			sizeValue.value *= 10
		return {
			id: getNodeId(),
			name: randomName("code") + `.${randValue([ "js", "c", "cpp", "java", "dll" ])}`,
			size: fileSize(sizeValue.size, SizeUnit.KO),
			type: FileType.PROTECTED,
			value: sizeValue.value * ctx.valueMultiplier
		}
	},
	Text: ctx => {
		let name = randBool(0.1) ? randName() : randomName("document")
		name = randBool(0.2) ? `${name}_${randValue(["final", "tmp", "final_final"])}` : name

		const sizeValue = getSizeValue(10, 150, 5, 20)
		const valueWithModifiers = sizeValue.value * ctx.valueMultiplier * keywordMultiplier(name)
		return {
			id: getNodeId(),
			name: name + `.${randValue(["txt", "doc", "xls", "pdf"])}`,
			size: fileSize(sizeValue.size, SizeUnit.KO),
			type: valueWithModifiers > 1000 ? FileType.PROTECTED : FileType.TEXT,
			value: valueWithModifiers
		}
	},
	Folder: ctx => {
		const result = {
			name: ctx.stack.length === 0 ? "" : randomName("folder"),
			type: FileType.FOLDER,
			children: []
		}

		ctx = Object.assign({}, ctx)
		ctx.stack.push(result)

		switch (result.name)
		{
			case "work":
				ctx.valueMultiplier += 4
				ctx.allowedTypes = [ "Text", "Critical", "Code", "WorkVideo" ]
				break
			case "important":
				ctx.valueMultiplier += 1
				break
			case "urgent":
				ctx.valueMultiplier += 2
				break
			case "paperwork":
				ctx.valueMultiplier += 3
				ctx.allowedTypes = [ "Text", "Critical" ]
				break
			case "documents":
				ctx.allowedTypes = [ "Text", "Code" ]
				break
			case "private":
				ctx.valueMultiplier += 2
				ctx.allowedTypes = [ "Text" ]
				break
			case "images":
				ctx.allowedTypes = [ "Picture", "Video" ]
				break
			case "videos":
				ctx.allowedTypes = [ "Picture", "Video" ]
				break
			case "backup":
				ctx.valueMultiplier += 3
				ctx.allowedTypes = [ "Critical", "Code", "Text" ]
				break
		}

		const depthMaxed = Math.min(ctx.stack.length, 5) - 1
		const minSubfolders = [4, 3, 1, 0, 0][depthMaxed]
		const maxSubfolders = [6, 4, 3, 2, 0][depthMaxed]
		let subFolderCount = 0
		const filesCount = randInt(10, 20)
		for (let i = 0; i < filesCount; i++)
		{
			const child = generateNode(ctx, gen => {
				if (subFolderCount === maxSubfolders)
					return gen !== "Folder"
				return ctx.allowedTypes.includes(gen) || randBool(0.01)
			})

			const isFolder = child.children !== undefined

			if (result.name === child.name || result.children.some(c => c.name === child.name))
			{
				i--
				continue;
			}

			if (isFolder)
				subFolderCount++

			result.children.push(child)
		}

		for (let i = subFolderCount; i < minSubfolders; i++)
		{
			const child = generateNode(ctx, gen => gen === "Folder")
			if (result.name === child.name || result.children.some(c => c.name === child.name))
			{
				i--
				continue;
			}
			result.children.push(child)
		}

		ctx.stack.pop()

		return result
	}
}

function fileSize(value, unit)
{
	let result = value * Math.pow(10, unit * 3)

	// Round the value (always int)
	// Min is 0 (no negative file)
	return Math.max(Math.round(result), 0)
}

function formatFileSize(value)
{
	if (value === 0)
		return "0 O"

	const unit = Math.floor(Math.log10(value) / 3)
	const unitLabel = Object.keys(SizeUnit)[unit]

	const valueInUnit = value / Math.pow(10, unit * 3)

	return `${valueInUnit.toFixed(3)} ${unitLabel}`
}

function generateNode(ctx, filterFn)
{
	let generators = Object.keys(NodeGenerators)
	if (filterFn !== undefined)
		generators = generators.filter(filterFn)
	return NodeGenerators[randValue(generators)](ctx)
}

let initialized = false

function generateFileTree()
{
	if (!initialized)
		initFileNames()

	const ctx = {
		stack: [],
		valueMultiplier: 1,
		allowedTypes: Object.keys(NodeGenerators).filter(gen => ![ "Critical", "Code", "WorkVideo" ].includes(gen))
	}
	const tree = [ ...NodeGenerators.Folder(ctx).children ]

	return tree
}

function randomName(category)
{
	return genText(randValue(FileNames[category]))
}

function genText(template)
{
	const result = template.replaceAll(/\[([a-z]+)\]/g, (_, group) => {
		let value = randValue(FileNames[group])
		if (value.match(/\[[a-z]+\]/))
			value = genText(value)
		return value
	})
	return result
}

function initFileNames()
{
	for (const category in FileNames)
	{
		const newList = []
		for (const val of FileNames[category])
		{
			if (val.startsWith("%"))
			{
				newList.push(...FileNames[val.substring(1)])
			}
			else
			{
				newList.push(val)
			}
		}
		FileNames[category] = newList
	}
}