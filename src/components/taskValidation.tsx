import { taskEntity } from "./taskEntity";

export function taskValidation(tasks: taskEntity[] , name: string): boolean 
{
    return tasks.every(task => task.name !== name);
}
