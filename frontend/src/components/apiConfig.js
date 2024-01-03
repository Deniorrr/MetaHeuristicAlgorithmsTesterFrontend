import axios from "axios";

const instance = axios.create({
  baseURL:
    "https://metaheuristicalgorithmstesterapi20240102183449.azurewebsites.net/",
});

export default instance;
