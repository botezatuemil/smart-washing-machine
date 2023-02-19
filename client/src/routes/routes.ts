import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from "axios";
import { IStudent } from "../interfaces/student.interface";

const url = "http://localhost:5000";

export const getStudents = () => axios.get(`${url}/getStudents`);