import { create } from "zustand";

interface ErrorLogStore {
    error : any,
   
    setError : (error : any) => void
}

export const useErrorLogStore = create<ErrorLogStore>((set) => ({
   error : null,
   setError : (error) => {
    set({
        error : error
    })
   }
}));
