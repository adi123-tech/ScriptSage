import React from 'react';
import Select from 'react-select';
import './compilernavbar.css';

const CompilerNavbar = ({ userLang, setUserLang, fontSize, setFontSize }) => {
  const languages = [{ value: "c", label: "C Programming Language" }];

  const handleFontSizeChange = (e) => {
    setFontSize(parseInt(e.target.value));
  };

  return (
    <div className="CompilerNavbar">
      <div className='title-C-Program'>
        <h1>C Programming Language Compiler</h1>
      </div>

      <label>Font Size</label>
      <input
        type="range"
        min="18"
        max="30"
        value={fontSize}
        step="2"
        onChange={handleFontSizeChange}
      />
    </div>
  );
};

export default CompilerNavbar;