import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { CoffeeStore } from "../lib/coffee-stores";

interface StoreProviderProps {
  children: ReactNode;
}

interface StoreProviderState {
  latlng: string;
  nearbyStores: CoffeeStore[];
}

export enum Actions {
  SET_LATLNG = "setLatlng",
  SET_NEARBY_STORES = "setNearbyStores",
}

type ActionType =
  | { type: Actions.SET_LATLNG; payload: string }
  | { type: Actions.SET_NEARBY_STORES; payload: CoffeeStore[] };

const initialState: StoreProviderState = {
  latlng: "",
  nearbyStores: [],
};

const storeReducer = (state: StoreProviderState, action: ActionType): StoreProviderState => {
  switch (action.type) {
    case Actions.SET_LATLNG:
      return { ...state, latlng: action.payload };
    case Actions.SET_NEARBY_STORES:
      return { ...state, nearbyStores: action.payload };
    default:
      throw new Error();
  }
};

interface StoreContextInterface {
  state: StoreProviderState;
  dispatch: Dispatch<ActionType>;
}
export const StoreContext = createContext<StoreContextInterface>({} as StoreContextInterface);

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};
