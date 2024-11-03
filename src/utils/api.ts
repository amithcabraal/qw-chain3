const DATAMUSE_API = 'https://api.datamuse.com/words';
const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export interface DictionaryResponse {
  word: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
    }[];
  }[];
}

export const fetchWordData = async (word: string) => {
  try {
    // Normalize the word to handle multi-word cases
    const normalizedWord = word.toLowerCase().trim();
    
    // Get dictionary definition
    const definitionResponse = await fetch(`${DICTIONARY_API}/${encodeURIComponent(normalizedWord)}`);
    let definition = 'Definition not available';
    
    if (definitionResponse.ok) {
      const definitionData: DictionaryResponse[] = await definitionResponse.json();
      definition = definitionData[0]?.meanings[0]?.definitions[0]?.definition || definition;
    }

    // Get synonyms with retry logic
    let synonyms: string[] = [];
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries && synonyms.length === 0) {
      try {
        const synonymResponse = await fetch(
          `${DATAMUSE_API}?rel_syn=${encodeURIComponent(normalizedWord)}&max=15`
        );
        
        if (synonymResponse.ok) {
          const synonymData: { word: string; score: number }[] = await synonymResponse.json();
          synonyms = synonymData
            .filter(item => item.score > 1000) // Filter out low-quality matches
            .map(item => item.word)
            .filter(syn => syn.toLowerCase() !== normalizedWord); // Remove self-references
        }
        
        break;
      } catch (error) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
      }
    }

    // If we still don't have synonyms, try related words as fallback
    if (synonyms.length === 0) {
      try {
        const relatedResponse = await fetch(
          `${DATAMUSE_API}?rel_trg=${encodeURIComponent(normalizedWord)}&max=10`
        );
        
        if (relatedResponse.ok) {
          const relatedData: { word: string; score: number }[] = await relatedResponse.json();
          synonyms = relatedData
            .filter(item => item.score > 500)
            .map(item => item.word)
            .filter(syn => syn.toLowerCase() !== normalizedWord);
        }
      } catch (error) {
        console.warn('Failed to fetch related words as fallback');
      }
    }

    // Ensure we have at least some synonyms
    if (synonyms.length === 0) {
      throw new Error('No synonyms found for this word');
    }

    return {
      word: normalizedWord,
      definition,
      synonyms
    };
  } catch (error) {
    console.error('Error fetching word data:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch word data'
    );
  }
};