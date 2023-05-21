import { Task } from "./Task";

export function taskValidation(tasks: Task[] , name: string): boolean 
{
    return tasks.every(task => task.name !== name);
}
