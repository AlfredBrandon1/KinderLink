import { createStore } from "redux";

// Define initial state
const initialState = {
    students: [],
};

// Define actions
export const addStudent = (student) => ({
    type: "ADD_STUDENT",
    payload: student,
});

export const updateStudent = (student) => ({
    type: "UPDATE_STUDENT",
    payload: student,
});

export const deleteStudent = (id) => ({
    type: "DELETE_STUDENT",
    payload: id,
});

// Define reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_STUDENT":
            return {
                ...state,
                students: [...state.students, action.payload],
            };
        case "UPDATE_STUDENT":
            return {
                ...state,
                students: state.students.map((student) =>
                    student.id === action.payload.id ? action.payload : student
                ),
            };
        case "DELETE_STUDENT":
            return {
                ...state,
                students: state.students.filter(
                    (student) => student.id !== action.payload
                ),
            };
        default:
            return state;
    }
};

// Create store
const store = createStore(reducer);

export default store;
