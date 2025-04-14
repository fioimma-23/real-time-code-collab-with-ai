const initialDetailsState = {
    loading: false,
    files: [],
    collaborators: [],
    error: null,
  };
  
  export const projectDetailsReducer = (state = initialDetailsState, action: any) => {
    switch (action.type) {
      case "FETCH_PROJECT_DETAILS_REQUEST":
        return { ...state, loading: true };
      case "FETCH_PROJECT_DETAILS_SUCCESS":
        return {
          loading: false,
          files: action.payload.files,
          collaborators: action.payload.collaborators,
          error: null,
        };
      case "FETCH_PROJECT_DETAILS_FAIL":
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  const initialFileState = {
    loading: false,
    file: null,
    error: null,
  };
  
  export const fileReducer = (state = initialFileState, action: any) => {
    switch (action.type) {
      case "FETCH_FILE_REQUEST":
        return { ...state, loading: true };
      case "FETCH_FILE_SUCCESS":
        return { ...state, loading: false, file: action.payload };
      case "FETCH_FILE_FAIL":
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  