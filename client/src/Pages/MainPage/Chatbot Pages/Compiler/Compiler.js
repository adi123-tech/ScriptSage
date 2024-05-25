import { useState, useEffect } from 'react';
import './Compiler.css';
import CompilerNavbar from './CompilerNavbar';
import Navbar from '../Navbar/Navbar';
import Axios from 'axios';
import Modal from './PopUpPage/Modal';

const beautifyMessage = (message) => {
    const formattedMessage = message
      .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>') 
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')       
      .replace(/\*(.*?)\*/g, '<em>$1</em>')                   
      .replace(/\n/g, '<br>');                                
  
    return `<div class='explanation-title' style='background-color: #283142; color: white; height: 300px; overflow-y: auto;'>${formattedMessage}</div>`;
};

function Compiler() {
    const [userCode, setUserCode] = useState(localStorage.getItem('userCode') || '');
    const [userLang, setUserLang] = useState('c');
    const [fontSize, setFontSize] = useState(20);
    const [userInput, setUserInput] = useState(localStorage.getItem('userInput') || '');
    const [userOutput, setUserOutput] = useState(localStorage.getItem('userOutput') || '');
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        localStorage.setItem('userCode', userCode);
    }, [userCode]);

    useEffect(() => {
        localStorage.setItem('userInput', userInput);
    }, [userInput]);

    useEffect(() => {
        localStorage.setItem('userOutput', userOutput);
    }, [userOutput]);

    function compile() {
        setLoading(true);
        if (userCode === '') {
            return;
        }

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

    function explainErrorOutput() {
        if (userOutput.trim() === '') {
            setExplanation('No output or error');
            setShowModal(true);
        } else {
            Axios.post('http://localhost:7000/api', {
                message: userOutput
            })
            .then((res) => {
                setExplanation(res.data.response);
                setShowModal(true);
            })
            .catch((err) => {
                console.error(err);
                setExplanation('Failed to get explanation.');
                setShowModal(true);
            });
        }
    }

    function clearOutput() {
        setUserOutput('');
        setExplanation('');
    }

    return (
        <div className="Compiler">
            <Navbar />
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
                        style={{ width: '100%', height: '85%', fontSize: `${fontSize}px` }}
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
                            style={{ width: '100%', height: '85%', fontSize: `${fontSize}px` }}
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
                            <button onClick={() => explainErrorOutput()} className="explain-btn">
                                Explain Error / Output
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p className="explanation-title">Explanation:</p>
                {/* Beautify the explanation content */}
                <div dangerouslySetInnerHTML={{__html: beautifyMessage(explanation)}} />
            </Modal>
        </div>
    );
}

export default Compiler;
