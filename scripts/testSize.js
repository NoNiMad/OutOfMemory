const fs = require("fs")

const stat = fs.statSync("../../OutOfMemory.zip")
console.log(stat.size)