import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from "axios";
import { IStudent } from "../interfaces";
import {PORT, IP} from "@env";

const url = `http://${IP}:${PORT}`;

export const getStudents = () => axios.get(`${url}/getStudents`);