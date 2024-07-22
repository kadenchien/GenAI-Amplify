 // src/Dropdown.js
import React, { useState } from 'react';
import './DropDown.css';

const DropDown = ({ options, onSelect }) => {
  const [selected, setSelected] = useState('Choose Model');
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    setIsLocked(true); // Lock the dropdown after first selection
    onSelect(option);
  };
  const selectedIndex = options.indexOf(selected);
  const imgSrc = `/images/${selectedIndex + 1}.png`;

  return (
    <div className="dropdown">
      <div className={`dropdown-header ${isLocked ? 'locked' : ''}`} onClick={() => !isLocked && setIsOpen(!isOpen)}>
        <div className ="dropdown-header-content">
            {isLocked && <img src={imgSrc} className="dropdown-image" alt="selected model" />} {/* Conditionally render image */}
            {selected}
        </div>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      {isOpen && (
        <ul className="dropdown-list">
           {options.map((option, index) => {
                const imgSrc = `/images/${index + 1}.png`;
                return (
                <li key={index} onClick={() => handleSelect(option)}>
                    <img src={imgSrc} className="dropdown-image"/>
                    {option}
                </li>
                );
            })}
        </ul>
      )}
    </div>
  );
};

export default DropDown;