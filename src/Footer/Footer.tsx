import React from 'react';
import "./Footer.css";

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="content-wrapper">
        <p>© {new Date().getFullYear()} Carbon Intensity Analysis. Data provided by National Grid</p>
      </div>
    </footer>
  );
};