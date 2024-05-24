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
      <Select
        options={languages}
        value={{ value: userLang, label: "C Programming Language" }}
        onChange={(e) => setUserLang(e.value)}
        placeholder="C Programming Language"
      />
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