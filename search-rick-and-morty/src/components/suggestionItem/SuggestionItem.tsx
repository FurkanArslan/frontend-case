import { Character } from '../../types/Character';
import './SuggestionItem.css';

interface SuggestionItemProps {
    character: Character;
    query: string;
    isSelected: boolean;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({ character, query, isSelected }) => {
    const matchIndex = character.name.toLowerCase().indexOf(query.toLowerCase());
    const beforeMatch = character.name.substring(0, matchIndex);
    const matchText = character.name.substring(matchIndex, matchIndex + query.length);
    const afterMatch = character.name.substring(matchIndex + query.length);

    return (
        <div className="suggestion-item  flex-center">
            <input
                type="checkbox"
                checked={isSelected}
                className="suggestion-checkbox"
            />
            <img src={character.image} alt={character.name} className="character-image" />
            <div className="flex-column">
                <div className="character-name">
                    {beforeMatch}
                    <strong>{matchText}</strong>
                    {afterMatch}
                </div>
                <div className="character-episodes">{character.episode.length} episodes</div>
            </div>
        </div>
    )
};

export default SuggestionItem;
