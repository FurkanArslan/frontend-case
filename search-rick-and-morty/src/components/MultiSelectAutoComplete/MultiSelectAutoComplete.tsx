import React, { useEffect, useState } from 'react';
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
          .then(characters  => {
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
        />
      </div>

      {isLoading ? <Spinner /> : null}

      {error && <div className="error-message">{error}</div>}

      {!isLoading && suggestions.length > 0 && (
        <SuggestionsList suggestions={suggestions} onItemClick={handleItemClick} query={inputValue} />
      )}
    </div>
  );

};

export default MultiSelectAutoComplete;
