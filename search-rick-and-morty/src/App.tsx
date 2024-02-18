import MultiSelectAutoComplete from './components/multiSelectAutoComplete/MultiSelectAutoComplete';
import './styles/colors.css';
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
