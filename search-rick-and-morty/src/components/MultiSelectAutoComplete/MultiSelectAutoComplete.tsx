import React, { useEffect, useState } from 'react';
import './MultiSelectAutoComplete.css';
import { Character } from '../../types/Character';
import Spinner from '../spinner/Spinner';
import SuggestionsList from '../suggestionsList/SuggestionsList';

const MultiSelectAutoComplete: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Character[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: { target: { value: any; }; }) => {
    setInputValue(event.target.value);
  };

  const handleItemClick = (itemName: string) => {
    if (!selectedItems.includes(itemName)) {
      setSelectedItems([...selectedItems, itemName]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setSelectedItems(selectedItems.filter(item => item !== itemToRemove));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue) {
        setIsLoading(true); // Yükleme başladı
        fetch(`https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(inputValue)}`)
          .then(response => response.json())
          .then(data => {
            if (data.results) {
              setSuggestions(data.results ? data.results : []);
              setIsLoading(false); // Yükleme bitti
            } else {
              setSuggestions([]);
              setIsLoading(false); // Hata durumunda yükleme bitti
            }
          })
          .catch(error => console.error('Error fetching data: ', error));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  return (
    <div className='multi-select-container'>
      <div className='selected-items'>
        {selectedItems.map(item => (
          <span key={item} onClick={() => handleRemoveItem(item)} className='selected-item'>
            {item} x
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className='autocomplete-input'
        placeholder="Search for a character..."
      />

      {isLoading ? <Spinner /> : null}

      {!isLoading && suggestions.length > 0 && (
        <SuggestionsList suggestions={suggestions} onItemClick={handleItemClick} query={inputValue} />
      )}
    </div>
  );

};

export default MultiSelectAutoComplete;
