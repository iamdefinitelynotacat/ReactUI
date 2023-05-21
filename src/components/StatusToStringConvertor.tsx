import { Status } from "./Status";

export function convertStatusToString(status: Status): string 
{
    switch (status){
        case Status.NotStarted:
            return 'Not Started';
        case Status.InProgress:
            return 'In Progress';
        case Status.Completed:
            return 'Completed';
        default:
            return 'Unknown';
    };
}