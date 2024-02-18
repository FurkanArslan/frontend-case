import { KeyboardEvent, useState } from 'react';
import { Character } from '../types/Character';

interface UseKeyboardNavigationProps {
    suggestions: Character[];
    selectedItems: string[];
    onSelectedItemsChange: (items: string[]) => void;
    onItemClicked: (itemName: string) => void;
    inputValue: string;
    onFocusSelectedItem: () => void;
    hideSuggestions: () => void;
}

export const useKeyboardNavigation = ({
    suggestions,
    selectedItems,
    onSelectedItemsChange,
    onItemClicked,
    inputValue,
    onFocusSelectedItem,
    hideSuggestions,
}: UseKeyboardNavigationProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const scrollToItem = (index: number) => {
        const item = document.querySelector(`#suggestion-${index}`);
        if (item) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();

                const nextIndexDown = activeIndex >= suggestions.length - 1 ? 0 : activeIndex + 1;
                setActiveIndex(nextIndexDown);
                scrollToItem(nextIndexDown);

                break;
            case 'ArrowUp':
                event.preventDefault();

                const nextIndexUp = activeIndex <= 0 ? suggestions.length - 1 : activeIndex - 1;
                setActiveIndex(nextIndexUp);
                scrollToItem(nextIndexUp);

                break;
            case 'Enter':
                event.preventDefault();

                if (activeIndex >= 0 && suggestions[activeIndex]) {
                    onItemClicked(suggestions[activeIndex].name);
                    setActiveIndex(-1);
                }
                break;
            case 'Tab':
                event.preventDefault();

                if (activeIndex === -1) {
                    setActiveIndex(suggestions.length > 0 ? 0 : -1);
                } else {
                    setActiveIndex(-1);
                    onFocusSelectedItem();
                }

                break;
            case 'Backspace':
                if (inputValue === '' && selectedItems.length > 0) {
                    event.preventDefault();
                    const newSelectedItems = selectedItems.slice(0, selectedItems.length - 1);
                    onSelectedItemsChange(newSelectedItems);
                }
                break;

            case 'Escape':
                event.preventDefault();

                hideSuggestions();
                break;
        }
    };

    return { handleKeyDown, activeIndex };
};
