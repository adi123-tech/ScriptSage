import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <div className="navbar-container">
      <nav>
        <ul className="navbar-list">
          <li>
            <NavLink to="/chatbot" className="navbar-link chatbot">
              Chatbot
            </NavLink>
          </li>
          <li>
            <NavLink to="/compiler" className="navbar-link compiler">
              Compiler
            </NavLink>
          </li>
          <li>
            <NavLink to="/questions" className="navbar-link problem">
                Problems
            </NavLink>
          </li>
          <li>
            <NavLink to="/quiz" className="navbar-link quiz">
              Quiz
            </NavLink>
          </li>
          <li>
            <NavLink to="/tutorials" className="navbar-link tutorials">
              Tutorials
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className="navbar-link settings">
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className="navbar-link logout">
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
