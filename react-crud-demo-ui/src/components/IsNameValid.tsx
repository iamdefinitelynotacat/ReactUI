import { Task } from "./Task";

export function isNameValid(tasks: Task[] , name: string): boolean 
{
    return tasks.every(task => task.name !== name);
}
