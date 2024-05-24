import React from 'react';
import Navbar from '../Navbar/Navbar';
import { useState } from 'react';
import './Compiler.css';
import axios from 'axios';
import { useUser } from '../../../../UserContext';
import CombineLogo from '../../../CombineLogoPage/CombineLogo';

function Compiler() {
  const { userId } = useUser();
  const [code, setCode] = useState(''); 
  const [language, setLanguage] = useState("c");
  const [output, setOutput] = useState("");
  const [statuc, setStatus] = useState("");
  const [jobId, setJobId] = useState("");

  const handleSubmit = async () => {
    console.log(code);
    const payload = {
      language: "c",
      code
    };
    try {
      setJobId("");
      setStatus("");
      setOutput("");

      const { data } = await axios.post("http://localhost:5000/run", payload);
      console.log(data);
      setJobId(data.jobId);
      let intervalId;

      intervalId = setInterval(async() => {
        const {data: dataRes} = await axios.get("http://localhost:5000/status", 
        {params: {id: data.jobId}});
        const {success, job, error} = dataRes;
        console.log(dataRes);

        if(success)
        {
          const {status: jobStatus, output: jobOutput} = job;
          setStatus(jobStatus);
          if(jobStatus === "pending")
          {
            return;
          }
          setOutput(jobOutput);
          clearInterval(intervalId);
        }
        else
        {
          setStatus("Error: Please retry.")
          console.error(error);
          clearInterval(intervalId);
          setOutput(error);
        }
        console.log(dataRes);
      }, 1000);

    } catch (error) {
      console.error(error.respose)
    }

  }

  return (
    <>
   <CombineLogo />
    <p className='user-id-compiler'>User ID: {userId}</p>
      <div className='outer-container'>
        <Navbar/>
        <h1>Compiler</h1><br/>
        <div className='compiler-container'>
          <label>Select Language: </label>
          <select
            value={language}
            onChange={
              (e) => {
                setLanguage(e.target.value);
                console.log(e.target.value);
              }
            }
            style={{color: "black"}}
          >
            <option value="c" style={{color: "black"}}>C</option>
            <option value='' style={{color: "black"}}>Other Lang</option>
          </select>
        </div>
        <br/>
        <div className='code-section'>
          <textarea rows={20} cols={75} value={code} onChange={(e) => {setCode(e.target.value)}} style={{color: "white", backgroundColor: "#283142"}}>
          </textarea>
        </div>
        <br></br>
        <button onClick={handleSubmit}>Submit</button>
        <div className='status-bar'  style={{color: "white"}}>
        {/* <p>
          { statusbar }
        </p> */}
        <p>
          { jobId && `JobID: ${jobId}` } 
        </p>
          <p>
            {output}
          </p>
        </div>
      </div>
    </>
  )
}

export default Compiler;