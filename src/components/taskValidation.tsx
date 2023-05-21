import { taskEntity } from './taskEntity';

export function taskValidation(
  tasks: taskEntity[],
  name: string,
): [boolean, string | undefined] {
  if (!name || !name.trim()) {
    return [false, 'Name cannot be empty'];
  }

  if (!tasks.every((task) => task.name !== name)) {
    return [false, 'Name already exists'];
  }

  return [true, undefined];
}
