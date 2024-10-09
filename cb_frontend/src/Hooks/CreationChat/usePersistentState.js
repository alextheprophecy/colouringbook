import { useState, useEffect, useCallback } from 'react';

const usePersistentState = (key, defaultValue) => {
    const [state, setStateInternal] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    const setState = useCallback((newState) => {
        const valueToStore = typeof newState === 'function' ? newState(state) : newState;
        setStateInternal(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
    }, [key, state]);

    return [state, setState];
};

export default usePersistentState;