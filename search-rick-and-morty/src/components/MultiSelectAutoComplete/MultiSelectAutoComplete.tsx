import React, { useEffect, useState, KeyboardEvent } from 'react';
import './MultiSelectAutoComplete.css';
import { Character } from '../../types/Character';
import Spinner from '../spinner/Spinner';
import SuggestionsList from '../suggestionsList/SuggestionsList';
import SelectedItems from '../selectedItems/SelectedItems';
import { fetchCharacters } from '../../utils/api';

const MultiSelectAutoComplete: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Character[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);

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
            console.error(error.message);
            setError('Characters could not be fetched.');
            setIsLoading(false);
          });
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault(); // Varsayılan yön tuşu davranışını engelle
        if (activeSuggestionIndex < suggestions.length - 1) {
          setActiveSuggestionIndex(activeSuggestionIndex + 1);
        } else {
          setActiveSuggestionIndex(-1); // Listenin sonunda input alanına odaklan
        }
        break;
      case 'ArrowUp':
        event.preventDefault(); // Varsayılan yön tuşu davranışını engelle
        if (activeSuggestionIndex > 0) {
          setActiveSuggestionIndex(activeSuggestionIndex - 1);
        }
        break;
      case 'Enter':
        event.preventDefault(); // Form gönderimini engelle
        if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
          handleItemClick(suggestions[activeSuggestionIndex].name);
          setActiveSuggestionIndex(-1);
        }
        break;
      case 'Tab':
        if (!event.shiftKey && activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
          event.preventDefault(); // Varsayılan Tab davranışını engelle
          handleItemClick(suggestions[activeSuggestionIndex].name);
          setActiveSuggestionIndex(-1);
        }
        break;
      case 'Backspace':
        if (inputValue === '' && selectedItems.length > 0) {
          event.preventDefault(); // Varsayılan Backspace davranışını engelle
          handleRemoveItem(selectedItems[selectedItems.length - 1]);
        }
        break;
      // Diğer klavye olayları...
    }
  };

  return (
    <div className='multi-select-container'>
      <div className='selected-items-input-wrapper'>
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
        <SuggestionsList suggestions={suggestions} onItemClick={handleItemClick} query={inputValue} activeSuggestionIndex={activeSuggestionIndex} />
      )}
    </div>
  );

};

export default MultiSelectAutoComplete;
