export const FETCH_PROJECT_DETAILS_REQUEST = "FETCH_PROJECT_DETAILS_REQUEST";
export const FETCH_PROJECT_DETAILS_SUCCESS = "FETCH_PROJECT_DETAILS_SUCCESS";
export const FETCH_PROJECT_DETAILS_FAIL = "FETCH_PROJECT_DETAILS_FAIL";

interface FileData {
  id: string;
  name: string;
  lastModified: string;
}

interface Collaborator {
  id: string;
  name: string;
}

interface ProjectDetailsState {
  loading?: boolean;
  files?: FileData[];
  collaborators?: Collaborator[];
  error?: string;
}

interface Action {
  type: string;
  payload?: {
    files: FileData[];
    collaborators: Collaborator[];
  } | string;
}

const initialState: ProjectDetailsState = {};

export const projectDetailsReducer = (
  state: ProjectDetailsState = initialState,
  action: Action
): ProjectDetailsState => {
  switch (action.type) {
    case FETCH_PROJECT_DETAILS_REQUEST:
      return { loading: true };
    case FETCH_PROJECT_DETAILS_SUCCESS:
      if (typeof action.payload === "string") return state;
      return {
        loading: false,
        files: action.payload?.files || [],
        collaborators: action.payload?.collaborators || [],
      };
    case FETCH_PROJECT_DETAILS_FAIL:
      return { loading: false, error: action.payload as string };
    default:
      return state;
  }
};
