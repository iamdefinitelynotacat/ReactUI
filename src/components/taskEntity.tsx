import { taskStatus } from "./taskStatus";

export type taskEntity = {
    key: string;
    name: string;
    priority: number;
    status: taskStatus;
  };