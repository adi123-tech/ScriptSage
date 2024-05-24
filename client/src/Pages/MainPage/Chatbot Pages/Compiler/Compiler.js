import { useState } from 'react';
import './Compiler.css';
import CompilerNavbar from './CompilerNavbar';
import Navbar from '../Navbar/Navbar';
import Axios from 'axios';

function Compiler() {
    // State variable to set user's source code
    const [userCode, setUserCode] = useState('');

    // State variable to set editor's default language
    const [userLang, setUserLang] = useState('c');

    // State variable to set editor's default theme
    const [userTheme, setUserTheme] = useState('vs-dark');

    // State variable to set editor's default font size
    const [fontSize, setFontSize] = useState(20);

    // State variable to set user's input
    const [userInput, setUserInput] = useState('');

    // State variable to set user's output
    const [userOutput, setUserOutput] = useState('');

    // Loading state variable to show spinner while fetching data
    const [loading, setLoading] = useState(false);

    // Function to call the compile endpoint
    function compile() {
        setLoading(true);
        if (userCode === '') {
            return;
        }

        // Post request to compile endpoint
        Axios.post('http://localhost:5000/compile', {
            code: userCode,
            language: userLang,
            input: userInput
        })
        .then((res) => {
            setUserOutput(res.data.output);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    // Function to clear the output screen
    function clearOutput() {
        setUserOutput('');
    }

    return (
        <div className="Compiler">
          <Navbar/>
            <CompilerNavbar
                userLang={userLang} setUserLang={setUserLang}
                fontSize={fontSize} setFontSize={setFontSize}
            />
            <div className="main">
                <div className="left-container">
                    <textarea
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        className="code-textarea"
                        style={{ width: '100%', height: '85%', fontSize: `${fontSize}px` }} // Adjust font size dynamically
                        placeholder="# Enter your code here"
                    />
                    <button className="run-btn" onClick={() => compile()}>
                        Run
                    </button>
                </div>
                <div className="right-container">
                    <h4>Input:</h4>
                    <div className="input-box">
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="input-textarea"
                            style={{ width: '100%', height: '85%', fontSize: `${fontSize}px` }} // Adjust font size dynamically
                            placeholder="Enter input here"
                        />
                    </div>
                    <h4>Output:</h4>
                    {loading ? (
                        <div className="spinner-box">
                            <img alt="Loading..." />
                        </div>
                    ) : (
                        <div className="output-box">
                            <pre style={{ fontSize: `${fontSize}px` }}>{userOutput}</pre>
                            <button onClick={() => clearOutput()} className="clear-btn">
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Compiler;
