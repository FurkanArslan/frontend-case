import React, { useEffect, useState } from 'react';
import styles from './MultiSelectAutoComplete.module.css';
import { Character } from '../../types/Character';

const MultiSelectAutoComplete: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState('');

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

  // Debounced input'u güncelle
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  // API'den veri çekme
  useEffect(() => {
    if (debouncedInputValue) {
      fetch(`https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(debouncedInputValue)}`)
        .then(response => response.json())
        .then(data => {
          if (data.results) {
            setSuggestions(data.results.map((character: Character) => character.name));
          } else {
            setSuggestions([]);
          }
        })
        .catch(error => console.error('Error fetching data: ', error));
    } else {
      setSuggestions([]);
    }
  }, [debouncedInputValue]);

  return (
    <div className={styles['multi-select-container']}>
      <div className={styles['selected-items']}>
        {selectedItems.map(item => (
          <span key={item} onClick={() => handleRemoveItem(item)} className={styles['selected-item']}>
            {item} x
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={styles['autocomplete-input']}
        placeholder="Başla yazmaya..."
      />
      {suggestions.length > 0 && (
        <ul className={styles['suggestions']}>
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              onClick={() => handleItemClick(suggestion)}
              className={`${styles['suggestion-item']}`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

};

export default MultiSelectAutoComplete;
