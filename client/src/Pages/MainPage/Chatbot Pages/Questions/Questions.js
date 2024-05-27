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
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [showModalProblem, setShowModalProblem] = useState(false); // Declaring showModalProblem state

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
                        index={index} // Pass the index as a prop
                        setSelectedQuestion={setSelectedQuestion}
                        setShowModalProblem={setShowModalProblem} // Passing setShowModalProblem as prop
                    />
                ))}
            </div>
        </>
    );
}

export default Questions;
