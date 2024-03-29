import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Quizlogo from './Quizlogo';
import './quiz.css';
import { useUser } from '../../../../UserContext';
import axios from 'axios';

function Quiz() {
  const { userId } = useUser();
  const [currentSection, setCurrentSection] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [sectionCompleted, setSectionCompleted] = useState(new Array(5).fill(false));
  const [sectionInitiallyWrong, setSectionInitiallyWrong] = useState(new Array(5).fill(true));

  useEffect(() => {
    // Define an async function to fetch quiz progress
    const fetchQuizProgress = async () => {
      try {
        const response = await axios.get(`/quiz-progress/${userId}`);
        const { success, quizProgress } = response.data;
        if (success) {
          // Update sectionCompleted based on fetched quiz progress
          const updatedSectionCompleted = new Array(5).fill(false);
          quizProgress.forEach((progress) => {
            updatedSectionCompleted[progress.sectionIndex] = progress.completed;
          });
          setSectionCompleted(updatedSectionCompleted);
        }
      } catch (error) {
        console.error('Error fetching quiz progress:', error);
      }
    };

    // Call the fetchQuizProgress function
    fetchQuizProgress();
  }, [userId]);

  const updateQuizProgress = async (sectionIndex, completed) => {
    try {
      await axios.post('/update-quiz-progress', { userId, sectionIndex, completed });
    } catch (error) {
      console.error('Error updating quiz progress:', error);
    }
  };


  const sections = [
    {
      topic: 'Variables',
      questions: [
        {
          question: 'What is the purpose of a variable in C?',
          options: ['To store data', 'To perform calculations', 'To define functions', 'To control flow'],
          correctAnswer: 'To store data'
        },
        {
          question: 'What is the data type of the variable "x" in the expression "int x = 5;"?',
          options: ['int', 'char', 'float', 'double'],
          correctAnswer: 'int'
        },
        {
          question: 'Which of the following is not a valid variable name in C?',
          options: ['my_var', '3var', '_var', 'var3'],
          correctAnswer: '3var'
        },
        {
          question: 'What happens if you declare a variable without initializing it in C?',
          options: ['It has an undefined value', 'It automatically gets initialized to 0', 'It causes a compilation error', 'It depends on the compiler'],
          correctAnswer: 'It has an undefined value'
        },
        {
          question: 'What is the scope of a variable declared inside a function in C?',
          options: ['Global scope', 'Function scope', 'Block scope', 'Local scope'],
          correctAnswer: 'Local scope'
        }
      ]
    },
    {
      topic: 'Data Types',
      questions: [
        {
          question: 'Which of the following is not a valid data type in C?',
          options: ['float', 'boolean', 'char', 'double'],
          correctAnswer: 'boolean'
        },
        {
          question: 'Which of the following is a valid data type to represent true or false in C?',
          options: ['int', 'bool', 'char', 'double'],
          correctAnswer: 'bool'
        },
        {
          question: 'What is the size of the "int" data type in C?',
          options: ['4 bytes', '2 bytes', '8 bytes', 'Depends on the compiler'],
          correctAnswer: 'Depends on the compiler'
        },
        {
          question: 'Which data type in C is used to store characters?',
          options: ['char', 'int', 'string', 'float'],
          correctAnswer: 'char'
        },
        {
          question: 'Which of the following is a valid string declaration in C?',
          options: ['string s;', 'char s[];', 'char* s;', 'str s;'],
          correctAnswer: 'char s[];'
        }        
      ]
    },
    {
      topic: 'Loops',
      questions: [
        {
          question: 'Which loop in C is used to execute a block of code repeatedly as long as a condition is true?',
          options: ['for loop', 'while loop', 'do-while loop', 'if-else loop'],
          correctAnswer: 'while loop'
        },
        {
          question: 'Which loop in C is guaranteed to execute the block of code at least once?',
          options: ['for loop', 'while loop', 'do-while loop', 'if-else loop'],
          correctAnswer: 'do-while loop'
        },
        {
          question: 'What is the syntax for the "for" loop in C?',
          options: ['for (initialization; condition; increment/decrement)', 'for (condition; initialization; increment/decrement)', 'for (increment/decrement; condition; initialization)', 'for (initialization; increment/decrement; condition)'],
          correctAnswer: 'for (initialization; condition; increment/decrement)'
        },
        {
          question: 'Which loop is more suitable when the number of iterations is not known beforehand?',
          options: ['for loop', 'while loop', 'do-while loop', 'All are suitable'],
          correctAnswer: 'while loop'
        },
        {
          question: 'In the "for" loop, which part is optional?',
          options: ['Initialization', 'Condition', 'Increment/Decrement', 'All are mandatory'],
          correctAnswer: 'All are mandatory'
        }        
      ]
    },
    {
      topic: 'Functions',
      questions: [
        {
          question: 'Which keyword is used to define a function in C?',
          options: ['function', 'define', 'func', 'def'],
          correctAnswer: 'function'
        },
        {
          question: 'What is the return type of a function that does not return any value?',
          options: ['void', 'null', 'int', 'None of the above'],
          correctAnswer: 'void'
        },
        {
          question: 'Which of the following is a valid way to declare a function in C?',
          options: ['int add(int a, int b) { return a + b; }', 'add(int a, int b) { return a + b; }', 'add(int a, b) { return a + b; }', 'add(a, b) { return a + b; }'],
          correctAnswer: 'int add(int a, int b) { return a + b; }'
        },
        {
          question: 'What is the maximum number of parameters a function can have in C?',
          options: ['256', '128', '64', 'Depends on the compiler'],
          correctAnswer: 'Depends on the compiler'
        },
        {
          question: 'What is the purpose of a function prototype in C?',
          options: ['To declare a function before its definition', 'To define a function before its declaration', 'To declare variables within a function', 'To provide a default value for function arguments'],
          correctAnswer: 'To declare a function before its definition'
        }        
      ]
    },
    {
      topic: 'Arrays',
      questions: [
        {
          question: 'Which of the following is the correct way to declare a 2D array in C?',
          options: ['int arr[10][10];', 'arr[];', 'int arr[][];', 'array[];'],
          correctAnswer: 'int arr[10][10];'
        },
        {
          question: 'What is the size of the array declared as int arr[5]; in C?',
          options: ['5 bytes', '10 bytes', '20 bytes', 'Depends on the compiler'],
          correctAnswer: 'Depends on the compiler'
        },
        {
          question: 'Which of the following is the correct syntax to access the element at row i and column j in a 2D array arr[][]?',
          options: ['arr(i, j)', 'arr[i, j]', 'arr[i][j]', 'arr(i)(j)'],
          correctAnswer: 'arr[i][j]'
        },
        {
          question: 'What is the index of the last element in an array with 10 elements in C?',
          options: ['9', '10', '11', 'Depends on the compiler'],
          correctAnswer: '9'
        },
        {
          question: 'Which function is used to dynamically allocate memory in C?',
          options: ['malloc()', 'calloc()', 'realloc()', 'alloc()'],
          correctAnswer: 'malloc()'
        }        
      ]
    },
  ];

  const startQuiz = (sectionIndex) => {
    if (sectionIndex === 0 || (quizResult && quizResult.correctAnswers >= 4) || sectionCompleted[sectionIndex - 1]) {
      setCurrentSection(sectionIndex);
      setQuizResult(null); // Reset quiz result
      setSelectedAnswers(new Array(sections[sectionIndex].questions.length).fill(null));
    } else {
      alert("Please unlock this section by scoring 4 or more correct answers in the previous sections.");
    }
  };

  const finishQuiz = async () => {
    // Calculate quiz result for the current section
    const questions = sections[currentSection].questions;
    const totalQuestions = questions.length;
    let correctAnswers = 0;
  
    questions.forEach((question, index) => {
      if (question.correctAnswer === selectedAnswers[index]) {
        correctAnswers++;
      }
    });
  
    setQuizResult({
      totalQuestions,
      correctAnswers
    });
  
    if (correctAnswers >= 4) {
      setSectionCompleted((prev) => {
        const updated = [...prev];
        updated[currentSection] = true;
        return updated;
      });
  
      // Update quiz progress in the backend
      await updateQuizProgress(currentSection, true);
    }
  
    if (correctAnswers === 0 && quizResult && quizResult.totalQuestions > 0) {
      setSectionInitiallyWrong((prev) => {
        const updated = [...prev];
        updated[currentSection] = true;
        return updated;
      });
    }
  };
  

  const handleOptionSelect = (index, option) => {
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[index] = option;
    setSelectedAnswers(updatedSelectedAnswers);
  };

  // Render the quiz questions
  const displayQuizQuestions = () => {
    return (
      <div>
        <h2>Quiz: {sections[currentSection].topic}</h2>
        <br />
        {sections[currentSection].questions.map((question, index) => (
          <div key={index} className="question">
            <p>{index + 1}. {question.question}</p>
            <div className="options">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <label>
                    <input
                      type="radio"
                      name={`question${index}`}
                      value={option}
                      checked={selectedAnswers[index] === option}
                      onChange={() => handleOptionSelect(index, option)}
                    />
                    {option}
                  </label>
                </div>
              ))}
            </div>
            <br />
          </div>
        ))}
        <div className='analyze-quiz'>
        <button onClick={finishQuiz}>Analyze Quiz</button>
        </div>
      </div>
    );
  };

  // Render the quiz result
  const displayQuizResult = () => {
    return (
      <div className="result">
        <h3>Quiz Result:</h3>
        <p>Total Questions: {quizResult.totalQuestions}</p>
        <p style={{ color: '#4CAF50' }}>Correct Answers: {quizResult.correctAnswers}</p>
        <div className="incorrect-answers">
          <h4 style={{ color: 'red' }}>Incorrect Answers: {quizResult.totalQuestions - quizResult.correctAnswers}</h4>
          <table className="table-border">
            <thead>
              <tr>
                <th>Question</th>
                <th>Correct Answer</th>
                <th>Your Wrong Answer</th>
              </tr>
            </thead>
            <tbody>
              {sections[currentSection].questions.map((question, index) => (
                selectedAnswers[index] !== question.correctAnswer && (
                  <tr key={index} className={`incorrect-answer ${sectionInitiallyWrong[currentSection] ? 'initially-wrong' : ''}`}>
                    <td>{question.question}</td>
                    <td>{question.correctAnswer}</td>
                    <td>{selectedAnswers[index]}</td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
        <div className='end-quiz'>
        <button onClick={redirectToStartQuiz}>End Quiz</button>
        </div>
        
      </div>
    );
  };

  // Reset quiz state and redirect to start quiz again
  const redirectToStartQuiz = () => {
    setCurrentSection(null);
    setSelectedAnswers([]);
    setQuizResult(null);
  };

  return (
    <>
    <p className='user-id-quiz'>User ID: {userId}</p>
    <div className='quiz-container'>
      <Navbar />
      <Quizlogo/>
      {currentSection === null ? (
        <div className='quiz-modules'> 
          {sections.map((section, index) => (
            <div key={index}>
              <button onClick={() => startQuiz(index)}>
                Start {section.topic} Quiz 
                {sectionInitiallyWrong[index] && !sectionCompleted[index] && <span className="initially-wrong">❌</span>}
                {sectionCompleted[index] && <span className="completed">👌</span>}
              </button>
              <br />
            </div>
          ))}

        </div>
      ) : (
        <div>
          {quizResult ? displayQuizResult() : displayQuizQuestions()}
        </div>
      )}
    </div>
    </>
  );
}

export default Quiz;
