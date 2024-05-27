import { useState,useRef, useEffect } from 'react';
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
    const [fontSize, setFontSize] = useState(18);
    const [userInput, setUserInput] = useState(localStorage.getItem('userInput') || '');
    const [userOutput, setUserOutput] = useState(localStorage.getItem('userOutput') || '');
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalNothing, setShowModalNothing] = useState(false);
    const [modalLoading, setModalLoading] = useState(false); // New state for modal loading
    const [selectedQuestion, setSelectedQuestion] = useState(localStorage.getItem('selectedQuestion') || '');

    useEffect(() => {
            localStorage.setItem('selectedQuestion', selectedQuestion);
    }, [selectedQuestion]);

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
            setLoading(false);
            setShowModalNothing(true);
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
        setShowModal(true);
        setModalLoading(true);
        if (userOutput.trim() === '') {
            setModalLoading(false);
            setExplanation('No output or error');
        } else {
            setModalLoading(true);
            const message = userCode + '\n\n' + userOutput; // Concatenating userCode and userOutput
            Axios.post('http://localhost:7000/api', {
                message: message
            })
            .then((res) => {
                setExplanation(res.data.response);
            })
            .catch((err) => {
                console.error(err);
                setExplanation('Failed to get explanation.');
            })
            .finally(() => {
                setModalLoading(false); // Reset modal loading state
            });
        }
    }
    

    function clearOutput() {
        setUserOutput('');
        setExplanation('');
    }
    
    const [position, setPosition] = useState({ x: 700, y: 230 });
const [dragging, setDragging] = useState(false);
const dragRef = useRef();

useEffect(() => {
  const handleMouseMove = (event) => {
    if (dragging) {
      setPosition({
        x: event.clientX - dragRef.current.offsetWidth / 2,
        y: event.clientY - dragRef.current.offsetHeight / 2
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
}, [dragging]);
      
    return (
        <div className="Compiler">
            <Navbar />
            <CompilerNavbar
                userLang={userLang} setUserLang={setUserLang}
                fontSize={fontSize} setFontSize={setFontSize}
            />
            <div
                className="transferred-question"
                style={{ top: position.y, left: position.x, cursor: dragging ? 'grabbing' : 'grab' }}
                ref={dragRef}
                onMouseDown={() => setDragging(true)}
                >
                <p style={{color : 'red'}}>Drag this box where you want</p>
                {selectedQuestion}
            </div>
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
                            style={{ width: '100%', height: '85%', fontSize: `${fontSize}px`}}
                            placeholder="Enter input here"
                        />
                    </div>
                    <h4>Output:</h4>
                    {loading ? (
                        <div className="spinner-box" style={{ backgroundColor: 'transparent', color: 'white',position: 'relative',bottom: '50px' }}>
                            <div className="loading-dot" />
                            <div className="loading-dot" />
                            <div className="loading-dot" />
                        </div>
                    ) : (
                        <div className="output-box">
                            <pre style={{ fontSize: `${fontSize}px`, height: '200px' }}>{userOutput}</pre>
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
            <Modal show={showModalNothing} handleClose={() => setShowModalNothing(false)}>
                <div style={{color: 'black'}}>Code Input Field is Empty!!!!</div>
            </Modal>
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                {modalLoading ? (
                    <div className="modal-loading" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>
                        <div className="loading-dot" />
                        <div className="loading-dot" />
                        <div className="loading-dot" />
                    </div>
                
                ) : (
                    <>
                        <p className="explanation-title">Explanation:</p>
                        {/* Beautify the explanation content */}
                        <div dangerouslySetInnerHTML={{__html: beautifyMessage(explanation)}} />
                    </>
                )}
            </Modal>
        </div>
    );
}

export default Compiler;
