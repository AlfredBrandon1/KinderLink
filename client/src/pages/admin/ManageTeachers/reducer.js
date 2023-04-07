import { createStore } from 'redux';
import teachersData from './teachersData';

const initialState = {
  teachers: teachersData,
};

const ADD_TEACHER = 'ADD_TEACHER';
const DELETE_TEACHER = 'DELETE_TEACHER';
const UPDATE_TEACHER = 'UPDATE_TEACHER';

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TEACHER:
      return { ...state, teachers: [...state.teachers, action.payload] };
    case DELETE_TEACHER:
      return
      case UPDATE_TEACHER:
        return {
          ...state,
          teachers: state.teachers.map(teacher =>
            teacher.id === action.payload.id ? action.payload : teacher
          ),
        };
      default:
        return state;
    }
  };
  
  export const addTeacher = teacher => ({ type: ADD_TEACHER, payload: teacher });
  export const deleteTeacher = id => ({ type: DELETE_TEACHER, payload: id });
  export const updateTeacher = teacher => ({ type: UPDATE_TEACHER, payload: teacher });
  
  const store = createStore(rootReducer);
  
  export default store;
  