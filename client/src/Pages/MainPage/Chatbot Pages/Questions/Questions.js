import React, { useState, useEffect } from 'react';
import './questions.css';
import Navbar from '../Navbar/Navbar';
import CombineLogo from '../../../CombineLogoPage/CombineLogo';
import Modal from '../Compiler/PopUpPage/Modal';
import { NavLink } from 'react-router-dom';

function Question({ questionText, index, setSelectedQuestion, setShowModalProblem }) {
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        const storedIndex = localStorage.getItem('QuestionIndex');
        setIsSelected(index === parseInt(storedIndex));
    }, [index]);

    const handleSelectQuestion = () => {
        setSelectedQuestion(questionText);
        localStorage.setItem('selectedQuestion', questionText); // Store question text in local storage
        localStorage.setItem('QuestionIndex', index); // Store index in local storage
        setShowModalProblem(true);
    };

    return (
        <div className={`question-problem ${isSelected ? 'selected' : ''}`}>
            <p>{questionText}</p>
            <button onClick={handleSelectQuestion}>
                Transfer to Compiler Page
            </button>
        </div>
    );
}

function Questions() {
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [showModalProblem, setShowModalProblem] = useState(false); // Declaring showModalProblem state
    const [selectedTopic, setSelectedTopic] = useState('');

    const questionsList = [
        {
            text: "Write a C program to find the factorial of a number.",
        },
        {
            text: "Write a C program to check if a number is prime.",
        },
        {
            text: "Write a C program to calculate the area of a circle.",
        },
        {
            text: "Implement a C program to sort an array using bubble sort.",
        },
        {
            text: "Write a C function to find the maximum of two numbers.",
        },
    ];

    const handleGenerateModal = () => {
        setShowGenerateModal(true);
    };

    const handleGenerateQuestion = async () => {
        try {
            const message = `Generate a logical scenario-based question on the topic: ${selectedTopic} in C language`;
            const response = await fetch('http://localhost:7000/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            const generatedQuestion = data.response.toString();
            
            // Store generated question in local storage
            localStorage.removeItem('QuestionIndex');
            localStorage.setItem('selectedQuestion', generatedQuestion);
            setSelectedQuestion(generatedQuestion);
            setShowModalProblem(true);
            setShowGenerateModal(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    


    return (
        <>
        <Modal show={showModalProblem} handleClose={() => setShowModalProblem(false)}>
                <div style={{color: 'black',fontWeight: 'bolder'}}>Well Done Question is Transferred Enjoy Coding ...</div>
                <NavLink to="/compiler" style={{position: 'fixed',top : '48%',right : '34%'}} className="navbar-link chatbot">
                    Go to Compiler
                </NavLink>
            </Modal>
            <Navbar />
            <CombineLogo />
            <div className="questions-container">
            <div className='quiz-module-name' style={{position: 'fixed', top: '8%'}}><h1 >Questions Modules</h1></div>
                {questionsList.map((question, index) => (
                    <Question
                        key={index}
                        questionText={question.text}
                        index={index} // Pass the index as a prop
                        setSelectedQuestion={setSelectedQuestion}
                        setShowModalProblem={setShowModalProblem} // Passing setShowModalProblem as prop
                    />
                ))}
            </div>
            <div className="instructions-container" style={{ position: 'fixed', transform: 'translateX(-50%)', top: '50%', left : '15%', textAlign: 'center', backgroundColor: '#56299E', padding: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.8)', borderRadius: '10px' }}>
            <h2>How to Use?</h2>
            <br></br>
            <ol style={{ textAlign: 'left' }}>
                <li>Select a question from the list.</li>
                <li>Click on the "Transfer to Compiler Page" button.</li>
                <li>Go to the Compiler tab to begin coding.</li>
            </ol>
        </div>
        {showGenerateModal && (
                <Modal show={showGenerateModal} handleClose={() => setShowGenerateModal(false)}>
                <div style={{ color: 'black', fontWeight: 'bolder', marginBottom: '20px' }}>Generate Question Based On :</div>
                <select
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            boxSizing: 'border-box',
                            marginBottom: '20px',
                            fontSize: '16px',
                            outline: 'none',
                            color: 'black'
                        }}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                    >
                        <option style={{ color: 'black' }} value="">Select a C Concept</option>
                        <option style={{ color: 'black' }} value="loops">Loops</option>
                        <option style={{ color: 'black' }} value="functions">Functions</option>
                        <option style={{ color: 'black' }} value="pointers">Pointers</option>
                        <option style={{ color: 'black' }} value="arrays">Arrays</option>
                        <option style={{ color: 'black' }} value="structures">Structures</option>
                        {/* Add more options as needed */}
                    </select>
                <button
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                    onClick={handleGenerateQuestion}
                >
                    Generate
                </button>
            </Modal>
            
            
            )}
            <div className="generate-questions-container" style={{ position: 'fixed', transform: 'translateX(-50%)', top: '50%', right: '-5%', textAlign: 'center', backgroundColor: '#56299E', padding: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.8)', borderRadius: '10px' }}>
                <h4>Click Below Button to Generate <br /> Questions on Particular Topic?</h4>
                <button onClick={handleGenerateModal}>Generate</button>
            </div>
        </>
    );
}

export default Questions;
