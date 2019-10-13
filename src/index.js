#!/usr/bin/env node
const path = require('path')
const fs = require('fs-extra')
const os = require('os')
const yargs = require("yargs")
const moment = require("moment")
const pdftk = require("node-pdftk")
const pdftkWindows = 'C:\\Program Files (x86)\\PDFtk Server\\bin\\pdftk.exe'
const pdftkLinux = 'TODO' // TODO

const dateFormat = 'YYYY.MM.DD'

const isWindows = () => process.platform.indexOf('win') > -1

function cleanUp(tempFolder) {
    try {
        console.log(`Removing folder: ${tempFolder}`)
        fs.removeSync(tempFolder)
    } catch (e) {
        console.error(`Failed to remove folder: ${tempFolder}`, e)
    }
}

const options = yargs
    .usage("Usage: --files <files> --output <outputFileName>")
    .option("f", {alias: "files", describe: "File containing list of files to merge in order listed", type: "string", demandOption: true})
    .option("o", {
        alias: "output",
        describe: `Output file name, for example: 'pdfmerge --files example.pdfmerge --output JohnDoePackage' would result in JohnDoePackage-${dateFormat}.pdf as in JohnDoePackage-${moment().format(dateFormat)}.pdf`,
        type: "string",
        demandOption: true
    })
    .option("b", {alias: "bin", describe: `The full path to the install location of pdftk. Use this if you get an error about pdftk not being found.`, type: "string", demandOption: false})
    .argv;

let files = fs.readFileSync(path.resolve(process.cwd(), options.files), 'UTF8').trim().split(/\r?\n/g).map(ele => path.resolve(ele))


let tempFiles = []
let tempFolder = path.join(os.tmpdir(), 'pdfm', options.output)
try {
    fs.ensureDirSync(tempFolder)
} catch (e) {
    let ne = new Error(`Failed to create temporary folder: ${tempFolder}`)
    ne.original = error
    ne.stack = ne.stack.split('\n').slice(0, 2).join('\n') + '\n' + error.stack
    throw ne
}

let fatal = false
for (let file of files) {
    if (!fatal) {
        let tmpFile = path.join(os.tmpdir(), 'pdfm', options.output, file.split(path.sep).pop())
        tempFiles.push(tmpFile)
        try {
            console.log(`Copying: ${file} to: ${tmpFile}`)
            fs.copySync(file, tmpFile)
        } catch (e) {
            console.error(`Failed to copy: ${file} to: ${tmpFile}`)
            fatal = true
        }
    }
}

if (!fatal) {
    let output = path.resolve(options.output)
    if (options.bin) {
        pdftk.configure({bin: path.resolve(options.bin) ? pdftkWindows : pdftkLinux})
    } else {
        pdftk.configure({bin: isWindows() ? pdftkWindows : pdftkLinux})
    }

    console.log(`Merging input files into: ${`${output}-${moment().format(dateFormat)}.pdf`}`)
    pdftk
        .input(tempFiles)
        .cat()
        .output(`${output}-${moment().format(dateFormat)}.pdf`)
        .then(()=>cleanUp(tempFolder))
        .catch((e)=>{
            console.error(`FATAL ERROR IN PDFTK!`, e)
            cleanUp(tempFolder)
        })

} else {
    console.error(`FATAL ERROR DETECTED! See above. This is most likely caused by a bad file reference. Check the file paths are correct. Cannot continue! Calling cleanup.`)
    cleanUp(tempFolder)
}



