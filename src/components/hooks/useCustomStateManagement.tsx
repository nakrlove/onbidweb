import { useState, useEffect } from "react";

const useCustomStateManagement = <T,>(initialState: T) => {
    const [state, setState] = useState<T>(initialState);

    const updateState = (newData: Partial<T>) => {
        setState((prevState) => ({
            ...prevState,
            ...newData,
        }));
    };

    const updateSpecificKey = <K extends keyof T>(key: K, value: T[K]) => {
        setState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    return { state, updateState, updateSpecificKey };
};

export default useCustomStateManagement;
