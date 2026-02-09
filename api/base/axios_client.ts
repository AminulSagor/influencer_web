
import { API_URL } from "@/config/env";
import axios from "axios"

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});
