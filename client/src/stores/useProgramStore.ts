import { create } from "zustand";
import { Program } from "../types/Program";
import { User } from "../types/User";
import { ValidationError } from "../types/ApiValidationError";

interface ProgramsStore { 
    programs : Program[] ,

    setPrograms : (programs: Program[]) => void,
    clear : () => void
}

export const useProgramsStore = create<ProgramsStore>((set) => ({
    programs : [],

    setPrograms: (programs : Program[]) => {
        set({programs: programs})
    },

    clear: () => set({
        programs: []
    })

}));

interface ProgramHeadState { 
    heads : User[] 
    programId : string|null
    name : string|null
    setHeads : (users : User[]) => void
    setProgram : (id:string, name : string) => void
    clear : () => void
}

// export const useProgramHeadStore = create<ProgramHeadState>((set) => ({
//     heads: [],
//     programId : null,
//     name : null,

//     setHeads : (users : User[]) => {
//         set({heads : users})
//     },

//     setProgram : (id:string, name:string) => {
//         set({programId : id, name: name})
//     },

//     clear : () => {
//         set({
//             heads : [],
//             programId : null
//         })
//     }
// }));


interface UpdateProgramState {
    program : Program|null
    programId : string | null
    errors : ValidationError[],
    formData : {
        id : string
        name : string
        management : string
    }

    setFormData : (name:string, val:string) => void
    clear : () => void
    setProgram : (program : Program) => void
    settProgramId : (id : string) => void
    setErrors : (errors : ValidationError[]) => void
}


export const useUpdateProgramStore = create<UpdateProgramState>((set) => ({
    program: null,
    programId: null,
    errors: [],
    formData : {
        name : "",
        id : "",
        management : ""
    },
    
    setFormData : (name, val) => {

    },
    setProgram: function (program: Program): void {
        set({
            program : program,
            formData : {
                name : program.name,
                id : program._id,
                management : program.management
            }
        })
    },
    settProgramId: function (id: string): void {
        set({
            programId : id,
        })
    },
    setErrors: function (errors: ValidationError[]): void {
        set({
            errors : errors
        })
    },
    clear: () => {
        set({
            program : null,
            programId : null,
            errors : []
        })
    }
}
))

