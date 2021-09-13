const fs = require("fs")

const enumList = JSON.parse(fs.readFileSync("enums.json"))

let code = ""

for (let enumName of Object.keys(enumList))
{
	const enumDef = enumList[enumName]
	code += `const ${enumName} =\r\n{\r\n`

	for (let i = 0; i < enumDef.length; i++)
	{
		const enumValDef = enumDef[i]
		if (typeof(enumValDef) === "object")
		{
			code += `\t${enumValDef.key}: ${JSON.stringify(enumValDef)}`
		}
		else
		{
			code += `\t${enumValDef}: ${i}`
		}

		if (i < enumDef.length - 1)
		{
			code += ","
		}
		code += "\r\n"
	}

	code += "}\r\n\r\n"
}

fs.writeFileSync("../enums.js", code)