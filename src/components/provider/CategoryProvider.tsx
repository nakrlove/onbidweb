import React, { createContext, useState, useContext } from 'react';
import {States} from '../interface/regst'


// CategoryContext의 타입 정의
interface CategoryContextType {
    categories: States[];
    setCategories: React.Dispatch<React.SetStateAction<States[]>>;
}

// Context 생성 (초기값 설정 필요)
const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<States[]>([]);

    return (
        <CategoryContext.Provider value={{ categories, setCategories }}>
            {children}
        </CategoryContext.Provider>
    );
};

// Context 사용 훅
export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategory는 CategoryProvider 내에서 사용되어야 합니다.");
    }
    return context;
};
