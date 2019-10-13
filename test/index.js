const md5 = require('md5')
const fs = require('fs-extra')
const {spawn, exec} = require('child_process')
const path = require('path')
const moment = require("moment")
const dateFormat = 'YYYY.MM.DD'

let command = `node src/index.js --output ./test/test --files ./test/testfiles.pdfm`
let outfile = path.resolve(`./test/test-${moment().format(dateFormat)}.pdf`)
let expected = path.resolve(`./test/expected.pdf`)
exec(command, async (error, stdout, stderr) => {
        if (error) {
            console.error(error)
        } else {
            let file = fs.readFileSync(outfile)
            let expectedFile = fs.readFileSync(expected)
            // todo
            // md5()
            console.log(stdout)
            console.log(md5(file))
            console.log(expectedFile.equals(file))
        }
    }
)
