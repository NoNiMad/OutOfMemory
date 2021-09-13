const fs = require("fs")
const path = require("path")

function concatFiles(files, dest)
{
	let text = ""
	for (const file of files)
	{
		text += fs.readFileSync(path.join("..", file)) + "\n"
	}
	
	fs.writeFileSync(path.join("..", "build", dest), text)
}

concatFiles([ "constants.js", "enums.js", "utils.js", "files.js", "upgrades.js", "game.js" ], "script.js")
concatFiles([ "style.css", "menu.css" ], "style.css")