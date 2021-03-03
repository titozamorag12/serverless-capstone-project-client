import { apiEndpoint } from "../config";
import { Execution } from "../types/Execution";
import { CreateExecutionRequest } from "../types/CreateExecutionRequest";
import Axios from "axios";
import { UpdateExecutionRequest } from "../types/UpdateExecutionRequest";

export async function getExecutions(idToken: string): Promise<Execution[]> {
  console.log("Fetching executions");

  const response = await Axios.get(`${apiEndpoint}/executions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
  console.log("executions:", response.data);
  return response.data.items;
}

export async function createExecution(
  idToken: string,
  newexecution: CreateExecutionRequest
): Promise<Execution> {
  const response = await Axios.post(
    `${apiEndpoint}/executions`,
    JSON.stringify(newexecution),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data.item;
}

export async function patchExecution(
  idToken: string,
  executionId: string,
  updatedexecution: UpdateExecutionRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/executions/${executionId}`,
    JSON.stringify(updatedexecution),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
}

export async function deleteExecution(
  idToken: string,
  executionId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/executions/${executionId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
}

export async function getUploadUrl(
  idToken: string,
  executionId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/executions/${executionId}/attachment`,
    "",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data.uploadUrl;
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file);
}
