// Navbar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navLinkStyles = {
    chatbot: {
      backgroundColor: '#4CAF50',
    },
    compiler: {
      backgroundColor: '#2196F3',
    },
    quiz: {
      backgroundColor: '#f44336',
    },
    tutorials: {
      backgroundColor: '#FFC107',
    },
    settings: {
      backgroundColor: '#9c27b0',
    },
  };

  return (
    <div className="nav1">
    <nav>
      <ul>
        <li>
          <NavLink to="/chatbot" style={navLinkStyles.chatbot}>
            Chatbot
          </NavLink>
        </li>
        <li>
          <NavLink to="/compiler" style={navLinkStyles.compiler}>
            Compiler
          </NavLink>
        </li>
        <li>
          <NavLink to="/quiz" style={navLinkStyles.quiz}>
            Quiz
          </NavLink>
        </li>
        <li>
          <NavLink to="/tutorials" style={navLinkStyles.tutorials}>
            Tutorials
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" style={navLinkStyles.settings}>
            Settings
          </NavLink>
        </li>
      </ul>
    </nav>
    </div>
  );
}
