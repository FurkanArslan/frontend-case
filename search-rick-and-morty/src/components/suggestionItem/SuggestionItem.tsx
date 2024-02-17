import { Character } from '../../types/Character';
import './SuggestionItem.css';

interface SuggestionItemProps {
    character: Character;
    query: string;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({ character, query }) => {
    const matchIndex = character.name.toLowerCase().indexOf(query.toLowerCase());
    const beforeMatch = character.name.substring(0, matchIndex);
    const matchText = character.name.substring(matchIndex, matchIndex + query.length);
    const afterMatch = character.name.substring(matchIndex + query.length);

    return (
        <div className="suggestion-item">
            <img src={character.image} alt={character.name} className="character-image" />
            <div className="character-info">
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
