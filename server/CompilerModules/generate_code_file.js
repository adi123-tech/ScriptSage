const { dir } = require('console');
const fs = require('fs');
const path = require('path');
const { v4:uuid } = require('uuid');

const dirCodes = path.join(__dirname, "codes");

if(!fs.existsSync(dirCodes))
{
    fs.mkdirSync(dirCodes, {recursive: true});
}

const generateFile = async(format, code) => {
    const jobId = uuid();  // Create unique job
    const filename = `${jobId}.${format}`;  // Join jobid and format. Eg: 102.cpp, 312.py

    const filepath = path.join(dirCodes, filename);  // Create file path from codes

    await fs.writeFileSync(filepath, code);  // Write content in feil

    return filepath;
};

module.exports = {
    generateFile,
};