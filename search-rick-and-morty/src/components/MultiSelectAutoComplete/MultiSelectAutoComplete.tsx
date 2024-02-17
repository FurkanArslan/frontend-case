import React, { useState } from 'react';
import styles from './MultiSelectAutoComplete.module.css';

const MultiSelectAutoComplete: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const allItems = ['Rick', 'Morty'];

  const handleInputChange = (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    setInputValue(value);
    if (!value) {
      setSuggestions([]);
    } else {
      setSuggestions(allItems.filter(item => item.toLowerCase().includes(value.toLowerCase())));
    }
  };

  const handleItemClick = (item: string) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setSelectedItems(selectedItems.filter(item => item !== itemToRemove));
  };

  console.log(styles)

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
