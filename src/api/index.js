import axios from "axios";

axios.defaults.baseURL = "https://sub.commo.fi/api";

export const Post = async ({ endpoint, data }) => {
  console.log("data :>> ", data, "endPoint", endpoint);
  return new Promise((resolve, reject) => {
    axios
      .post(endpoint, data, {
        headers: {
          "content-type": "application/json",
          Authorization: "",
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("Error", endpoint, error);
        reject(error);
      });
  });
};

export const PostFormData = async ({ endpoint, data }) => {
  return new Promise((resolve, reject) => {
    axios
      .put(endpoint, data, {
        headers: {
          Authorization: "",
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
        },
        transformRequest: (data_, headers) => {
          console.log(endpoint, data);
          return data;
        },
      })
      .then((response) => {
        console.log(endpoint, response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(endpoint, error);
        reject(error);
      });
  });
};

export const PostFormData_PostAPI = async ({ endpoint, data }) => {
  return new Promise((resolve, reject) => {
    axios
      .post(endpoint, data, {
        headers: {
          Authorization: "",
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
        },
        transformRequest: (data_, headers) => {
          console.log(endpoint, data);
          return data;
        },
      })
      .then((response) => {
        console.log(endpoint, response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(endpoint, error);
        reject(error);
      });
  });
};

export const Delete = async ({ endpoint, params }) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(endpoint, {
        params,
        headers: {
          "content-type": "application/json",
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const Get = async ({ endpoint, params }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(endpoint, {
        params: params,
        headers: {
          "content-type": "application/json",
        },
      })
      .then((response) => {
        console.log(endpoint, response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.log("Error", endpoint, error);
        reject(error);
      });
  });
};
