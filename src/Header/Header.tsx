import React from 'react';
import "./Header.css";

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="content-wrapper">
        <h1 className="main-title">Carbon Intensity Monitoring System</h1>
      </div>
    </header>
  );
};