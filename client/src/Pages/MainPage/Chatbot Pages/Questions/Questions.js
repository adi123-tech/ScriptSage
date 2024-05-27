// In Questions.js
import React, { useState } from 'react';
import './questions.css';
import Navbar from '../Navbar/Navbar';
import CombineLogo from '../../../CombineLogoPage/CombineLogo';
import Modal from '../Compiler/PopUpPage/Modal';
import { NavLink } from 'react-router-dom';

function Question({ questionText, setSelectedQuestion, setShowModalProblem }) {
    const handleSelectQuestion = () => {
        setSelectedQuestion(questionText);
        localStorage.setItem('selectedQuestion', questionText); // Store in local storage
        setShowModalProblem(true);
    };

    return (
        <div className="question-problem">
            <p>{questionText}</p>
            <button onClick={handleSelectQuestion}>
                Transfer to Compiler Page
            </button>
        </div>
    );
}

function Questions() {
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [showModalProblem, setShowModalProblem] = useState(false); // Declaring showModalProblem state

    const questionsList = [
        {
            text: "Write a C program to find the factorial of a number.",
        },
        {
            text: "Write a C program to check if a number is prime.",
        },
    ];

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
                {questionsList.map((question, index) => (
                    <Question
                        key={index}
                        questionText={question.text}
                        setSelectedQuestion={setSelectedQuestion}
                        setShowModalProblem={setShowModalProblem} // Passing setShowModalProblem as prop
                    />
                ))}
            </div>
        </>
    );
}

export default Questions;
