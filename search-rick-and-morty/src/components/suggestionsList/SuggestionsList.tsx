import { Character } from '../../types/Character';
import './SuggestionsList.css';
import SuggestionItem from '../suggestionItem/SuggestionItem';

interface SuggestionsListProps {
    suggestions: Character[];
    onItemClick: (name: string) => void;
    query: string;
    activeSuggestionIndex: number;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions, onItemClick, query, activeSuggestionIndex }) => (
    <ul className="suggestions-list">
        {suggestions.map((character, index) => (
            <li key={character.id} onClick={() => onItemClick(character.name)} style={{ backgroundColor: index === activeSuggestionIndex ? '#f0f0f0' : 'transparent' }}
            >
                <SuggestionItem character={character} query={query} />
            </li>
        ))}
    </ul>
);

export default SuggestionsList;
