import React from 'react';
import Navbar from '../Navbar/Navbar'; // Assuming you have a Navbar component in the correct path
import "./Tutorials.css";
import { NavLink } from 'react-router-dom';
import { useUser } from '../../../../UserContext';
import CombineLogo from '../../../CombineLogoPage/CombineLogo';

function Tutorials() {
  const { userId } = useUser();
  const cProgrammingInfo = [
    {
      heading: "Introduction to C Programming",
      content: [
        "C is a general-purpose programming language.",
        "It was developed by Dennis Ritchie at Bell Labs in the early 1970s.",
        "C is a structured programming language.",
        "It is known for its efficiency and is widely used in developing system software and applications.",
        "Here's a simple 'Hello, World!' program in C to get you started:",
        "***********************************",
        " #include <stdio.h>",
        " int main() {",
        "   printf('Hello, World!\\n');",
        "   return 0;",
        " }",
        "***********************************"
      ]
    },
    {
      heading: "Variables in C",
      content: [
        "Variables in C are used to store data.",
        "They have a data type that determines the type of data they can hold (such as int, float, char, etc.) and a name that allows them to be referenced in the program.",
        "Here's an example of variable declaration and initialization in C:",
        "*********************************",
        "int age; // Declaration",
        "age = 30; // Initialization",
        "*********************************"
      ]
    },
    {
      heading: "Data Types in C",
      content: [
        "Data types in C specify the type of data that variables can store.",
        "C supports several basic data types, including:",
        "- int: Used for integers (whole numbers).",
        "- float: Used for floating-point numbers (numbers with decimal points).",
        "- char: Used for single characters (letters, digits, symbols).",
        "- double: Used for double-precision floating-point numbers (more precision than float).",
        "- void: Represents the absence of type or a generic pointer.",
        "Here's an example of declaring variables with different data types:",
        "******************************",
        "int age = 30;",
        "float height = 5.9;",
        "char grade = 'A';",
        "double pi = 3.14159265359;",
        "void *ptr = NULL;",
        "******************************"
      ]
    },
    {
      heading: "For Loops in C",
      content: [
        "For loops in C are used to execute a block of code repeatedly for a fixed number of times.",
        "The syntax of a for loop in C is as follows:",
        "***********************************************************************",
        "for (initialization; condition; increment/decrement) {",
        "    // Code to be executed",
        "}",
        "***********************************************************************",
        "Here's an example of using a for loop to print numbers from 1 to 5:",
        "*******************************",
        "int i;",
        "for (i = 1; i <= 5; i++) {",
        "    printf('%d\\n', i);",
        "}",
        "*******************************",
        "In this example, the loop initializes the variable 'i' to 1, executes the code block as long as 'i' is less than or equal to 5, and increments 'i' by 1 in each iteration.",
        "You can use for loops to iterate over arrays, perform mathematical calculations, and more."
      ]
    },
    {
      heading: "Functions in C",
      content: [
        "Functions in C are blocks of code that perform a specific task.",
        "They are reusable and modular, allowing complex programs to be broken down into smaller, manageable parts.",
        "Functions can have parameters (input values) and return a value after performing their task.",
        "Here's an example of a function in C:",
        "*******************************",
        "// Function declaration",
        "int add(int a, int b);",
        "// Function definition",
        "int add(int a, int b) {",
        "    return a + b;",
        "}",
        "// Function call",
        "int result = add(3, 7);",
        "*******************************"
      ]
    },
    {
      heading: "Arrays in C",
      content: [
        "Arrays in C allow you to store multiple values of the same data type under a single variable name.",
        "The elements of an array are stored in contiguous memory locations, and each element can be accessed using its index.",
        "The syntax for declaring an array in C is as follows:",
        "***********************************************************************************",
        "data_type array_name[array_size];",
        "***********************************************************************************",
        "Here's an example of declaring and initializing an array in C:",
        "***********************************************************************************",
        "int numbers[5]; // Declares an array of integers with size 5",
        "int i;",
        "for (i = 0; i < 5; i++) {",
        "    numbers[i] = i + 1; // Initializes elements of the array with values 1 to 5",
        "}",
        "***********************************************************************************",
        "In this example, an array 'numbers' of size 5 is declared and initialized with values 1 to 5 using a for loop.",
        "You can perform various operations on arrays, such as accessing elements, modifying values, and passing arrays to functions."
      ]
    },
    {
      heading: "Pointers in C",
      content: [
        "Pointers are variables that store memory addresses of other variables.",
        "They allow you to directly manipulate memory and access data stored at a specific memory location.",
        "In C, pointers are widely used for dynamic memory allocation, passing parameters by reference, and implementing data structures like linked lists and trees.",
        "The syntax for declaring a pointer in C is as follows:",
        "```c",
        "data_type *pointer_name;",
        "```",
        "Here's an example of declaring and using pointers in C:",
        "```c",
        "int num = 10;",
        "int *ptr; // Declares a pointer to an integer",
        "ptr = &num; // Assigns the memory address of 'num' to the pointer",
        "printf('Value of num: %d\\n', num);",
        "printf('Value stored at the memory address pointed by ptr: %d\\n', *ptr);",
        "```",
        "In this example, a pointer 'ptr' is declared to point to an integer. The address-of operator '&' is used to assign the memory address of the variable 'num' to the pointer. The value stored at the memory address pointed by 'ptr' is accessed using the dereference operator '*'.",
        "Pointers are powerful but require careful handling to avoid memory leaks and undefined behavior."
      ]
    }
    // Add more categories as needed
  ];

  function scrollToSection(sectionId) {
    const heading = document.getElementById(sectionId);
    if (heading) {
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function generateMenuItems() {
    return cProgrammingInfo.map((section, index) => (
      <button className='menu-button' key={index} onClick={() => scrollToSection(`section-${index}`)}>
        <p>{section.heading}</p>
      </button>
    ));
  }

  return (
    <div>
      <CombineLogo />
      <p className='user-id-quiz'>User ID: {userId}</p>
      <Navbar />
      {/* <h1 style={{ textAlign: 'center' }}>Tutorials on C Programming</h1> */}
      <div className="tutorials-container">
        <div className="menubar">
          {generateMenuItems()}
          <NavLink to="/chatbot" style={{ color: '#ADD8E6' }}>
            Help ?
          </NavLink>

        </div>
        <div className="content">
          {cProgrammingInfo.map((section, index) => (
            <div key={index} id={`section-${index}`}>
              <h2>{section.heading}</h2>
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex}>{paragraph}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tutorials;
