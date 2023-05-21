import { Status } from "./Status";

export type Task = {
    key: string;
    name: string;
    priority: number;
    status: Status;
  };