import { combineReducers } from "redux";
import { projectDetailsReducer, fileReducer } from "./projectReducer";

const rootReducer = combineReducers({
  projectDetails: projectDetailsReducer,
  file: fileReducer,
});

export default rootReducer;
