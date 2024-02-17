import { Character } from '../../types/Character';
import './SuggestionsList.css';
import SuggestionItem from '../suggestionItem/SuggestionItem';

interface SuggestionsListProps {
    suggestions: Character[];
    onItemClick: (name: string) => void;
    query: string
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions, onItemClick, query }) => (
    <ul className="suggestions-list">
        {suggestions.map(character => (
            <li key={character.id} onClick={() => onItemClick(character.name)}>
                <SuggestionItem character={character} query={query} />
            </li>
        ))}
    </ul>
);

export default SuggestionsList;
