import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from "axios";
import { IStudent } from "../interfaces/student.interface";
import {PORT, IP} from "@env";

const url = `http://${IP}:${PORT}`;

export const getStudents = () => axios.get(`${url}/getStudents`);