import { convertStatusToString } from "../convertStatusToString";
import { taskStatus } from "../taskStatus";

test('status conversion', () =>{

    expect(convertStatusToString(taskStatus.NotStarted)).toBe('Not Started');
    expect(convertStatusToString(taskStatus.InProgress)).toBe('In Progress');
    expect(convertStatusToString(taskStatus.Completed)).toBe('Completed');
    expect(convertStatusToString('abcd')).toBe('abcd');
} );