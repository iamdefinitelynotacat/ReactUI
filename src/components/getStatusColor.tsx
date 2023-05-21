import { MantineTheme } from "@mantine/core";
import { taskStatus } from "./taskStatus";

export function getStatusColor(status: taskStatus, theme: MantineTheme) 
{
  switch (status){
      case taskStatus.NotStarted:
          return theme.colors.yellow[8];
      case taskStatus.InProgress:
          return theme.colors.green[8];
      case taskStatus.Completed:
          return theme.colors.gray[8];
      default:
          return theme.colors.red[8];
  };
}