import { combineReducers, createStore, applyMiddleware } from "redux";
import { codeReducer } from "./codeReducer";
import { authReducer } from "./authReducer"; 
import { customerReducer, customFieldReducer } from "./customerReducer";
import { usersReducer } from "./adminReducer";
import { taskReducer } from "./task/taskReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  codes : codeReducer,
  customer: customerReducer,
  customField: customFieldReducer,
  user: usersReducer,
  tasks: taskReducer
});


export default rootReducer;
