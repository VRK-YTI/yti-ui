import {createContext, Dispatch, SetStateAction} from 'react';

type SearchContextState = {
  isSearchActive: boolean;
  setIsSearchActive: Dispatch<SetStateAction<boolean>>;
}

const initialSearchContext: SearchContextState = {
  isSearchActive: false,
  setIsSearchActive: () => undefined
};

export const SearchContext = createContext<SearchContextState>(initialSearchContext);
