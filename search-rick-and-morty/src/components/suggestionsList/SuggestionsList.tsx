import { Character } from '../../types/Character';
import './SuggestionsList.css';
import SuggestionItem from '../suggestionItem/SuggestionItem';

interface SuggestionsListProps {
    suggestions: Character[];
    onItemClick: (name: string) => void;
    query: string;
    activeIndex: number;
    selectedItems: string[];
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions, onItemClick, query, activeIndex, selectedItems }) => (
    <ul className="suggestions-list">
        {suggestions.map((character, index) => (
            <li
                key={character.id}
                onClick={() => onItemClick(character.name)}
                style={{ backgroundColor: index === activeIndex ? '#f0f0f0' : 'transparent' }}
                id={`suggestion-${index}`}
                className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
            >
                <SuggestionItem character={character} query={query} isSelected={selectedItems.includes(character.name)} />
            </li>
        ))}
    </ul>
);

export default SuggestionsList;
