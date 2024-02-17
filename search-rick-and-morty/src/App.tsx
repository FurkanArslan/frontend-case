import React from 'react';
import MultiSelectAutoComplete from './components/MultiSelectAutoComplete/MultiSelectAutoComplete';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <h1>Rick and Morty Character Search</h1>
      <MultiSelectAutoComplete />
    </div>
  );
};

export default App;
