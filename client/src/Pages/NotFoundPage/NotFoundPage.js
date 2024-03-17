import React, { useEffect } from 'react';
import './notfoundpage.css';

function NotFoundPage() {
  useEffect(() => {
    const initializeAnimation = () => {
      const container = document.querySelector('.notfound-container');
      const h1 = container.querySelector('h1');
      if (!container || !h1) return; // Ensure elements are found before proceeding

      // Function to generate random position within window dimensions
      const getRandomPosition = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const h1Width = h1.offsetWidth;
        const h1Height = h1.offsetHeight;

        const randomLeft = Math.floor(Math.random() * (windowWidth - h1Width));
        const randomTop = Math.floor(Math.random() * (windowHeight - h1Height));

        return { left: randomLeft, top: randomTop };
      };

      const setRandomPosition = (element) => {
        const { left, top } = getRandomPosition();
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
      };

      // Clone h1 element for animation
      const h1Clone = h1.cloneNode(true);
      h1Clone.classList.add('cloned-text');

      // Set initial random position for cloned element
      setRandomPosition(h1Clone);

      // Append cloned element to the container
      container.appendChild(h1Clone);

      // Function to continuously update position and color of cloned element
      const updatePositionAndColor = () => {
        setRandomPosition(h1Clone);
        // Generate random color in hexadecimal format
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        h1Clone.style.color = randomColor; // Apply random color to the text
        // Adjust the speed by increasing the interval (e.g., 1000ms = 1 second)
        setTimeout(updatePositionAndColor, 100); // Update position and color every 0.1 second
      };

      // Start updating position and color
      updatePositionAndColor();

      // Clean up function to remove cloned element when the component unmounts
      return () => {
        container.removeChild(h1Clone);
      };
    };

    initializeAnimation();
  }, []); // Empty dependency array ensures that this effect runs only once, similar to componentDidMount

  return (
    <div className='notfound-container'>
        <img src="/404.jpeg" alt=""/>
        <h1>You Didn't Know the URL BRO....</h1>
    </div>
  );
}

export default NotFoundPage;
