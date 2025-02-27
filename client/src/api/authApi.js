import axios from "axios";
import { config, configHeaders } from "./config";

export const refreshToken = async (ref_token) => {
    const headers = configHeaders(ref_token);
    return axios.post(config.authPath + '/refresh-token', {}, headers);
};