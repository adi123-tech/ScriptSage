import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
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
    {
      topic: 'Pointers',
      questions: [
        {
          question: 'What is a pointer in C?',
          options: ['A variable that stores the address of another variable', 'A variable that stores a value', 'A special type of function', 'A data type'],
          correctAnswer: 'A variable that stores the address of another variable'
        },
        {
          question: 'What is the operator used to access the value pointed to by a pointer in C?',
          options: ['*', '&', '->', '.'],
          correctAnswer: '*'
        },
        {
          question: 'Which of the following correctly assigns the address of variable "x" to pointer "ptr" in C?',
          options: ['ptr = &x;', 'ptr = *x;', 'ptr = x;', 'ptr = &&x;'],
          correctAnswer: 'ptr = &x;'
        },
        {
          question: 'What happens if you dereference a null pointer in C?',
          options: ['Segmentation fault', 'Compilation error', 'Undefined behavior', 'Nothing happens'],
          correctAnswer: 'Undefined behavior'
        },
        {
          question: 'Which of the following is the correct way to declare a pointer to an integer in C?',
          options: ['int *ptr;', 'ptr int;', 'int ptr;', 'pointer int;'],
          correctAnswer: 'int *ptr;'
        }        
      ]
    },{
      topic: 'Structures',
      questions: [
        {
          question: 'What is a structure in C?',
          options: ['A collection of variables', 'A function', 'A loop', 'A conditional statement'],
          correctAnswer: 'A collection of variables'
        },
        {
          question: 'How do you access members of a structure in C?',
          options: ['.', '&', '*', '->'],
          correctAnswer: '.'
        },
        {
          question: 'Which keyword is used to define a structure in C?',
          options: ['class', 'struct', 'typedef', 'def'],
          correctAnswer: 'struct'
        },
        {
          question: 'What is the size of an empty structure in C?',
          options: ['1 byte', '0 bytes', 'Depends on the compiler', 'Cannot be determined'],
          correctAnswer: '1 byte'
        },
        {
          question: 'Which of the following correctly declares a structure named "Person" with members "name" and "age" in C?',
          options: ['struct Person { char* name; int age; };', 'Person { char* name; int age; };', 'struct { char* name; int age; } Person;', 'typedef struct { char* name; int age; } Person;'],
          correctAnswer: 'struct Person { char* name; int age; };'
        }        
      ]
    },
    {
      topic: 'File Handling',
      questions: [
        {
          question: 'What is file handling in C?',
          options: ['Manipulating files on a computer', 'Handling errors in files', 'Creating temporary files', 'Removing files'],
          correctAnswer: 'Manipulating files on a computer'
        },
        {
          question: 'Which library is used for file handling in C?',
          options: ['stdio.h', 'file.h', 'io.h', 'fstream.h'],
          correctAnswer: 'stdio.h'
        },
        {
          question: 'What is the function used to open a file in C?',
          options: ['open()', 'fopen()', 'fileopen()', 'readfile()'],
          correctAnswer: 'fopen()'
        },
        {
          question: 'Which mode is used to open a file in read mode in C?',
          options: ['r', 'w', 'a', 'rb'],
          correctAnswer: 'r'
        },
        {
          question: 'What is the function used to close a file in C?',
          options: ['fclose()', 'close()', 'fileclose()', 'endfile()'],
          correctAnswer: 'fclose()'
        }        
      ]
    },
    {
      topic: 'Dynamic Memory Allocation',
      questions: [
        {
          question: 'What is dynamic memory allocation in C?',
          options: ['Allocating memory at compile time', 'Allocating memory at runtime', 'Deallocating memory', 'Checking memory leaks'],
          correctAnswer: 'Allocating memory at runtime'
        },
        {
          question: 'Which function is used to allocate memory dynamically in C?',
          options: ['malloc()', 'alloc()', 'calloc()', 'new'],
          correctAnswer: 'malloc()'
        },
        {
          question: 'What is the purpose of realloc() function in C?',
          options: ['To allocate memory', 'To deallocate memory', 'To change the size of allocated memory', 'To free memory'],
          correctAnswer: 'To change the size of allocated memory'
        },
        {
          question: 'What happens if dynamic memory allocation fails in C?',
          options: ['Compilation error', 'Segmentation fault', 'Memory leak', 'Returns NULL'],
          correctAnswer: 'Returns NULL'
        },
        {
          question: 'Which header file is required for dynamic memory allocation in C?',
          options: ['stdlib.h', 'memory.h', 'alloc.h', 'malloc.h'],
          correctAnswer: 'stdlib.h'
        }        
      ]
    },
    {
      topic: 'Preprocessor Directives',
      questions: [
        {
          question: 'What are preprocessor directives in C?',
          options: ['Commands to the compiler', 'Comments', 'Data types', 'Loop constructs'],
          correctAnswer: 'Commands to the compiler'
        },
        {
          question: 'Which symbol is used to indicate a preprocessor directive in C?',
          options: ['#', '@', '&', '$'],
          correctAnswer: '#'
        },
        {
          question: 'What is the purpose of #include directive in C?',
          options: ['To include a file in the source code', 'To define a function', 'To declare a variable', 'To create a loop'],
          correctAnswer: 'To include a file in the source code'
        },
        {
          question: 'Which directive is used to define a macro in C?',
          options: ['#define', '#macro', '#function', '#var'],
          correctAnswer: '#define'
        },
        {
          question: 'What is the purpose of #ifdef directive in C?',
          options: ['To check if a macro is defined', 'To include a file conditionally', 'To declare a variable', 'To iterate over a loop'],
          correctAnswer: 'To check if a macro is defined'
        }        
      ]
    },
    {
      topic: 'Strings',
      questions: [
        {
          question: 'What is a string in C?',
          options: ['A sequence of characters', 'A data type', 'A loop construct', 'A variable'],
          correctAnswer: 'A sequence of characters'
        },
        {
          question: 'Which library is used for string manipulation in C?',
          options: ['stdio.h', 'string.h', 'stdlib.h', 'math.h'],
          correctAnswer: 'string.h'
        },
        {
          question: 'How do you declare a string in C?',
          options: ['char str[];', 'string str;', 'str str[];', 'char* str;'],
          correctAnswer: 'char str[];'
        },
        {
          question: 'Which function is used to find the length of a string in C?',
          options: ['strlen()', 'length()', 'strlength()', 'size()'],
          correctAnswer: 'strlen()'
        },
        {
          question: 'What happens if you try to modify a string literal in C?',
          options: ['Results in undefined behavior', 'Compilation error', 'Segmentation fault', 'Nothing happens'],
          correctAnswer: 'Results in undefined behavior'
        }
      ]
    },
    {
      topic: 'Recursion',
      questions: [
        {
          question: 'What is recursion in programming?',
          options: ['A loop construct', 'A function calling itself', 'A data type', 'A branching structure'],
          correctAnswer: 'A function calling itself'
        },
        {
          question: 'What is the base case in recursion?',
          options: ['The case where the function stops calling itself', 'The case where the function calls itself', 'The initial condition', 'The termination condition'],
          correctAnswer: 'The case where the function stops calling itself'
        },
        {
          question: 'What is the factorial of 0?',
          options: ['0', '1', 'Undefined', 'Depends on the compiler'],
          correctAnswer: '1'
        },
        {
          question: 'What is tail recursion?',
          options: ['A recursive function where the recursive call is the last operation', 'A recursive function that doesn\'t call itself', 'A type of loop', 'A recursive function with multiple base cases'],
          correctAnswer: 'A recursive function where the recursive call is the last operation'
        },
        {
          question: 'What is the drawback of recursion?',
          options: ['Increased memory usage', 'Slower execution time', 'Limited use cases', 'Difficult to implement'],
          correctAnswer: 'Increased memory usage'
        }
      ]
    },
    {
      topic: 'Enums',
      questions: [
        {
          question: 'What is an enum in C?',
          options: ['A data type used to define a set of named integer constants', 'A loop construct', 'A library function', 'A type of pointer'],
          correctAnswer: 'A data type used to define a set of named integer constants'
        },
        {
          question: 'How do you declare an enum in C?',
          options: ['enum Color { RED, GREEN, BLUE };', 'enum = { RED, GREEN, BLUE };', 'enum { RED, GREEN, BLUE };', 'Color { RED, GREEN, BLUE };'],
          correctAnswer: 'enum Color { RED, GREEN, BLUE };'
        },
        {
          question: 'What is the value of the first constant in an enum if not specified?',
          options: ['0', '1', 'Depends on the compiler', 'Undefined'],
          correctAnswer: '0'
        },
        {
          question: 'Can you assign custom values to enum constants in C?',
          options: ['Yes', 'No', 'Depends on the compiler', 'Only to some constants'],
          correctAnswer: 'Yes'
        },
        {
          question: 'What is the size of an enum in C?',
          options: ['Depends on the compiler', '1 byte', '4 bytes', '8 bytes'],
          correctAnswer: 'Depends on the compiler'
        }
      ]
    },
    {
      topic: 'Bit Manipulation',
      questions: [
        {
          question: 'What is bit manipulation in C?',
          options: ['Manipulating bits of a variable directly', 'A loop construct', 'A function', 'A type of pointer'],
          correctAnswer: 'Manipulating bits of a variable directly'
        },
        {
          question: 'Which operator is used for bitwise AND in C?',
          options: ['&', '|', '^', '<<'],
          correctAnswer: '&'
        },
        {
          question: 'What is the result of bitwise OR operation between 1011 and 1100?',
          options: ['1111', '1101', '1010', '1001'],
          correctAnswer: '1111'
        },
        {
          question: 'What does the left shift operator do in bit manipulation?',
          options: ['Shifts bits to the left by a specified number of positions', 'Shifts bits to the right by a specified number of positions', 'Flips all bits', 'Does nothing'],
          correctAnswer: 'Shifts bits to the left by a specified number of positions'
        },
        {
          question: 'Which function is used to set a particular bit in C?',
          options: ['|', '&', '^', '<<'],
          correctAnswer: '|'
        }
      ]
    },
    {
      topic: 'Pointers and Arrays',
      questions: [
        {
          question: 'What is the relationship between pointers and arrays in C?',
          options: ['Arrays are accessed using pointers', 'Pointers are accessed using arrays', 'There is no relationship', 'They are completely different'],
          correctAnswer: 'Arrays are accessed using pointers'
        },
        {
          question: 'How can you dynamically allocate an array in C using pointers?',
          options: ['Using malloc()', 'Using sizeof() operator', 'Using free()', 'Using realloc()'],
          correctAnswer: 'Using malloc()'
        },
        {
          question: 'What is pointer arithmetic in C?',
          options: ['Performing arithmetic operations on pointers', 'A type of loop', 'A library function', 'A type of pointer'],
          correctAnswer: 'Performing arithmetic operations on pointers'
        },
        {
          question: 'What does the expression "ptr++" do for a pointer ptr in C?',
          options: ['Increments the pointer to point to the next element', 'Decrements the pointer to point to the previous element', 'Does nothing', 'Frees memory'],
          correctAnswer: 'Increments the pointer to point to the next element'
        },
        {
          question: 'How do you access the third element of an array using a pointer in C?',
          options: ['*(arr + 2)', '*(arr + 3)', '*(arr - 2)', '*(arr - 3)'],
          correctAnswer: '*(arr + 2)'
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
      {currentSection === null ? (
        <div className='quiz-modules'> 
          {sections.map((section, index) => (
            <div key={index}>
              <button onClick={() => startQuiz(index)}>
              <span className="quiz-number">Quiz No. {index + 1}</span><br />
                Start {section.topic} Quiz 
                {sectionInitiallyWrong[index] && !sectionCompleted[index] && <span className="initially-wrong">❌</span>}
                {sectionCompleted[index] && <span className="completed">✅</span>}
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
