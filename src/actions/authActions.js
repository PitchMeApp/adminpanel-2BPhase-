import axios from "axios";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  ADMIN_LOADED,
  AUTH_FAIL,
  LOGOUT,
} from "./types";
import { setAlert } from "./alertAction";
import setAuthToken from "../Helpers/setAuthToken";
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const PROXY = process.env.REACT_APP_URL + "api/";
// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.tokenAdmin) {
    setAuthToken(localStorage.tokenAdmin);
  }

  try {
    const res = await axios.post(PROXY + "admin/auth");
    dispatch({
      type: ADMIN_LOADED,
      payload: res.data,
    });
    return res;
  } catch (error) {
    dispatch({
      type: AUTH_FAIL,
    });
  }
};

export const login = (userObj) => async (dispatch) => {
  const body = JSON.stringify(userObj);
  try {
    const res = await axios.post(PROXY + "admin/login", body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    // return res;
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
    });
    if (error.response) {
      dispatch(setAlert(error.response.data.message, "danger"));
    } else {
      dispatch(setAlert("Error occurred, Please try again later", "danger"));
    }
  }
};

export const forgotPassword = (userObj) => async (dispatch) => {
  const body = JSON.stringify(userObj);
  try {
    const res = await axios.post(PROXY + "admin/forgot-password", body, config);
    dispatch(setAlert(res.data.message, "success"));
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
    });
    if (error.response.data.message) {
      dispatch(setAlert(error.response.data.message, "danger"));
    } else {
      dispatch(setAlert("Error occurred, Please try again later", "danger"));
    }
  }
};

export const changePassword = (objPassword) => async (dispatch) => {
  const body = JSON.stringify(objPassword);
  try {
    const res = await axios.put(PROXY + "admin/change-password", body, config);
    dispatch(setAlert(res.data.message, "success"));
    return res;
  } catch (error) {
    if (error.response.data.message) {
      dispatch(setAlert(error.response.data.message, "danger"));
    } else {
      dispatch(setAlert("Error occurred, Please try again later", "danger"));
    }
  }
};

export const updateProfile = (submitData) => async (dispatch) => {
  let formData = new FormData();
  formData.append("id", submitData.id);
  formData.append("name", submitData.name);
  formData.append("email", submitData.email);

  if (submitData.profile_pic !== "") {
    formData.append("profile_pic", submitData.profile_pic);
  }

  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  return axios.put(PROXY + "admin/update-profile", formData, config);
};

export const logout = () => async (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};
