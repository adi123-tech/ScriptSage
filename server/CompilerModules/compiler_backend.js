const express = require('express');
const cors = require('cors');

const { generateFile } = require('./generate_code_file')
const  { executeCode } = require('./execute_code')
const Job = require('./models/Job'); // Importing Job for creating each run a job.

const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/compilerapp');
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
// 54TJzLdNseySLVOp

const app = express();


app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.get("/status", async(req, res) => {
    const jobId = req.query.id;

    if(jobId == undefined)
    {
        return res.status(400).json({success: false, error: "missing id query param"})
    }

    try {
        const job = await Job.findById(jobId);

        if(job === undefined)
        {
            return res.status(404).json({success: false, error: "invalid job id"});
        }

        return res.status(200).json(job)
    } catch (error) {
        return res.status(400).json({success: false, error: JSON.stringify(err)});
    }

})

app.post("/run", async (req, res) => {

    const { language = "c", code } = req.body;
    console.log(language, code.length);

    // Check if code is given or not
    if(code === undefined)
    {
        return res.status(400).json({success: false, error: "Empty code body"})
    }

    let job;

    try {
        // Generate a c file with content from the request
        const filepath = await generateFile(language, code);
        console.log(filepath);

        job = await new Job({language, filepath}).save();
        const jobId = job["_id"];
        
        res.status(201).json({success: true, jobId});
        
        job["startedAt"] = new Date();
        // Run the file and send the response back
        const output = await executeCode(filepath);
        console.log({filepath, output});
        
        job["completedAt"] = new Date();
        job["status"] = "success";
        job["output"] = output;
        
        await job.save();
        
        console.log(job);
        // return res.json({ filepath, output });
    } catch (err)
    {
        job["compeltedAt"] = new Date();
        job["status"] = "error";
        job["output"] = JSON.stringify(err);
        await job.save();
        console.log(err);
        // res.status(500).json({ err });
    }
});

app.listen(5000, () => {
    console.log('Listening on port 5000')
})
