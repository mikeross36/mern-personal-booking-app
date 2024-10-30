import { createContext, useCallback, useMemo, useReducer } from "react";
import { UserType } from "@/@types/users";
import { toast } from "react-toastify";
import { useLocalStorage } from "@/hooks";

type StateType = {
  authUser: UserType | null;
};

type ActionType = {
  type: string;
  payload: UserType | null;
};

export type DispatchType = (action: ActionType) => void;

const initialState: StateType = {
  authUser: null,
};

export const AppContext = createContext<
  { state: StateType; dispatch: DispatchType } | undefined
>(undefined);

export const SET_USER = "SET_USER";

function appReducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case SET_USER: {
      return { ...state, authUser: action.payload };
    }
    default: {
      toast.warning(`unhandled action type: ${action.type}`);
      return state;
    }
  }
}

function usePersistedReducer() {
  const [savedState, setSavedState] = useLocalStorage<StateType>(
    "authUser",
    initialState
  );
  const reducerLocalStorage = useCallback(
    (state: StateType, action: ActionType) => {
      const newState = appReducer(state, action);
      setSavedState(newState);
      return newState;
    },
    [setSavedState]
  );
  return useReducer(reducerLocalStorage, savedState);
}

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = usePersistedReducer();
  const value = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
