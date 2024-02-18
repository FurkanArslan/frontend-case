import React, { useEffect, useState, useRef } from 'react';
import './MultiSelectAutoComplete.css';
import { Character } from '../../types/Character';
import Spinner from '../spinner/Spinner';
import SuggestionsList from '../suggestionsList/SuggestionsList';
import SelectedItems from '../selectedItems/SelectedItems';
import { fetchCharacters } from '../../utils/api';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import ErrorMessage from '../errorMessages/ErrorMessage';

const MultiSelectAutoComplete: React.FC = () => {
  // State tanımlamaları
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Character[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  // Referans tanımlamaları
  const selectedItemsRef = useRef<HTMLDivElement>(null);

  // Event fonksiyonları
  const handleInputChange = (event: { target: { value: any; }; }) => {
    setInputValue(event.target.value);
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setSelectedItems(selectedItems.filter(item => item !== itemToRemove));
  };


  const handleFocus = () => {
    if (selectedItemsRef.current && selectedItems.length > 0) {
      selectedItemsRef.current.focus();
    }
  };

  // Karakterin seçili olup olmadığını kontrol et ve buna göre ekle veya çıkar
  const handleToggleSelectedItem = (itemName: string) => {
    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.includes(itemName)) {
        return prevSelectedItems.filter(item => item !== itemName);  // Eğer zaten seçiliyse, listeden çıkar
      } else {
        return [...prevSelectedItems, itemName]; // Eğer seçili değilse, listeye ekle
      }
    });
  };

  const handleToggleSuggestionsVisibility = () => {
    setIsSuggestionsVisible(prevState => !prevState);
  };

  const { handleKeyDown, activeIndex } = useKeyboardNavigation({
    suggestions,
    selectedItems,
    onSelectedItemsChange: (items: string[]) => setSelectedItems(items),
    onItemClicked: handleToggleSelectedItem,
    inputValue,
    onFocusSelectedItem: handleFocus,
    hideSuggestions: () => setIsSuggestionsVisible(false),
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
            setIsSuggestionsVisible(true);
          })
          .catch((error: Error) => {
            setError(error.message);
            setIsLoading(false);
            setSuggestions([]);
            setIsSuggestionsVisible(false);
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
        className='selected-items-input-wrapper flex-center'
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

        <button onClick={handleToggleSuggestionsVisibility} className="toggle-suggestions-button">
          {(isSuggestionsVisible && suggestions.length > 0) ? '▲' : '▼'}
        </button>
      </div>

      {isLoading ? <Spinner /> : null}

      {error && <ErrorMessage message={error} />}

      {isSuggestionsVisible && !isLoading && suggestions.length > 0 && (
        <SuggestionsList
          suggestions={suggestions}
          onItemClick={handleToggleSelectedItem}
          query={inputValue}
          activeIndex={activeIndex}
          selectedItems={selectedItems}
        />
      )}
    </div>
  );

};

export default MultiSelectAutoComplete;
