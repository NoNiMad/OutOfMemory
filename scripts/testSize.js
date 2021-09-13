const fs = require("fs")

const stat = fs.statSync("../build/build.zip")
console.log(stat.size)