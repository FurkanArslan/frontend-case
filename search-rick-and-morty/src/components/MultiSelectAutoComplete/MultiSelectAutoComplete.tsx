import React, { useEffect, useState, useRef } from 'react';
import './MultiSelectAutoComplete.css';
import { Character } from '../../types/Character';
import Spinner from '../spinner/Spinner';
import SuggestionsList from '../suggestionsList/SuggestionsList';
import SelectedItems from '../selectedItems/SelectedItems';
import { fetchCharacters } from '../../utils/api';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

const MultiSelectAutoComplete: React.FC = () => {
  // State tanımlamaları
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Character[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Referans tanımlamaları
  const selectedItemsRef = useRef<HTMLDivElement>(null);

  // Event fonksiyonları
  const handleInputChange = (event: { target: { value: any; }; }) => {
    setInputValue(event.target.value);
  };

  const handleItemClick = (itemName: string) => {
    if (!selectedItems.includes(itemName)) {
      setSelectedItems([...selectedItems, itemName]);
    }
    setInputValue('');
    setSuggestions([]);
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setSelectedItems(selectedItems.filter(item => item !== itemToRemove));
  };


  const handleFocus = () => {
    if (selectedItemsRef.current && selectedItems.length > 0) {
      selectedItemsRef.current.focus();
    }
  };

  const { handleKeyDown, activeIndex } = useKeyboardNavigation({
    suggestions,
    selectedItems,
    onSelectedItemsChange: (items: string[]) => setSelectedItems(items),
    handleItemClick,
    inputValue,
    onFocusSelectedItem: handleFocus,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue) {
        setIsLoading(true); // Yükleme başladı
        setError(null); // Her yeni aramada hata durumunu sıfırla

        fetchCharacters(inputValue)
          .then(characters => {
            setSuggestions(characters);
            setIsLoading(false);
          })
          .catch((error: Error) => {
            setError(error.message);
            setIsLoading(false);
            setSuggestions([]);
          });
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
      <div
        className='selected-items-input-wrapper'
        ref={selectedItemsRef}
        tabIndex={-1}
      >
        <SelectedItems selectedItems={selectedItems} onRemoveItem={handleRemoveItem} />

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className='autocomplete-input'
          placeholder="Search for a character..."
          onKeyDown={handleKeyDown}
        />
      </div>

      {isLoading ? <Spinner /> : null}

      {error && <div className="error-message">{error}</div>}

      {!isLoading && suggestions.length > 0 && (
        <SuggestionsList
          suggestions={suggestions}
          onItemClick={handleItemClick}
          query={inputValue}
          activeIndex={activeIndex}
        />
      )}
    </div>
  );

};

export default MultiSelectAutoComplete;
