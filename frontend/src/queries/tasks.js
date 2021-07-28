import axios from "axios";
import { tokenConfig } from "../components/common/axiosConfig";

export const moveTask = async (data) => {
  const { token, taskId, source, destination } = data;
  const body = JSON.stringify({ source, destination });
  return await axios.put(
    `/api/projects/req/task/${taskId}/move/`,
    body,
    tokenConfig(token)
  );
};
