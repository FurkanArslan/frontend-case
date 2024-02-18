import { ApiResult } from "../types/ApiResult";
import { Character } from "../types/Character";

export const fetchCharacters = async (query: string): Promise<Character[]> => {
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error('Error fetching characters');
        }
        const data: ApiResult = await response.json();

        return data.results || [];
    } catch (error) {
        console.error('Error fetching characters:', error);

        throw error;
    }
}
