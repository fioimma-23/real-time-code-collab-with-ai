import axios from "axios";

export const fetchProjectDetails = (projectId: string) => async (dispatch: any) => {
  try {
    dispatch({ type: "FETCH_PROJECT_DETAILS_REQUEST" });

    const [filesRes, collaboratorsRes] = await Promise.all([
      axios.get(`/api/projects/${projectId}/files`),
      axios.get(`/api/projects/${projectId}/collaborators`),
    ]);

    dispatch({
      type: "FETCH_PROJECT_DETAILS_SUCCESS",
      payload: {
        files: filesRes.data,
        collaborators: collaboratorsRes.data,
      },
    });
  } catch (error: any) {
    dispatch({
      type: "FETCH_PROJECT_DETAILS_FAIL",
      payload: error.message,
    });
  }
};

export const fetchFileContent = (fileId: string) => async (dispatch: any) => {
  try {
    dispatch({ type: "FETCH_FILE_REQUEST" });

    const { data } = await axios.get(`/api/files/${fileId}`);

    dispatch({
      type: "FETCH_FILE_SUCCESS",
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: "FETCH_FILE_FAIL",
      payload: error.message,
    });
  }
};
