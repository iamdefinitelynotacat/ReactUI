import { useCallback, useMemo, useState } from 'react';
import {
  MantineReactTable,
  MantineReactTableProps,
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
} from 'mantine-react-table';
import {
  Box,
  ActionIcon,
  Tooltip,
  Button,
} from '@mantine/core';
import {useQuery} from '@tanstack/react-query';
import { IconTrash, IconEdit, IconRefresh } from '@tabler/icons-react';
import { taskEntity } from './taskEntity';
import { NewTaskModal } from './NewTaskModal';
import { taskValidation } from './taskValidation';
import { convertStatusToString } from './convertStatusToString';

//Url for my test API
const apiUrl = 'http://localhost:5260';

//Creates MainTable
export const TaskTableWithoutQueryClient = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[cellId: string]: string;}>({});

  //fetch data using GET
  const { data, isError, isFetching, isLoading, refetch } =
    useQuery<taskEntity[]>({

      queryKey: ['table-data'],      

      queryFn: async () => {

        const fetchURL = new URL('/Task', apiUrl);

        const response = await fetch(fetchURL.href);

        const json = (await response.json()) as taskEntity[];

        return json;

      },

      keepPreviousData: true,

    });

  //new row hanlder
  const handleCreateNewRow = (values: taskEntity) => {
    addOrEditTask(values);
  };

  //POST to server
  const addOrEditTask = (task: taskEntity) => 
  {
    const fetchURL = new URL('/Task', apiUrl); 

    fetch(fetchURL.href,{ method: 'POST',   
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    }, 
    body: JSON.stringify(task)  
  }).then(() =>
    {
      refetch();
    });
  }


  const handleSaveRowEdits: MantineReactTableProps<taskEntity>['onEditingRowSave'] =
    async ({ exitEditingMode, values }) => {
      if (!Object.keys(validationErrors).length) {
        addOrEditTask(values);
        exitEditingMode(); //required to exit editing mode and close modal
      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = (row: MRT_Row<taskEntity>) => 
  {
    if (!window.confirm(`Are you sure you want to delete Task named: ${row.getValue('name')}`)) {
      return;
    }
    
    const fetchURL = new URL('/Task', apiUrl);
    fetchURL.searchParams.set('key', row.getValue('key'));

    fetch(fetchURL.href,{ method: 'DELETE' }).then(() =>
    {
      refetch();
    });
    
  }

  //used for validation
  const getCommonEditTextInputProps = useCallback(
    (
      cell: MRT_Cell<taskEntity>,
    ): MRT_ColumnDef<taskEntity>['mantineEditTextInputProps'] => {
      return {
        error: validationErrors[cell.id],
        onBlur: (event) => {

          const isValid = cell.column.id === 'name' ? taskValidation(data?.filter(task => task.key !== cell.row.getValue('key')) ?? [], event.target.value) : true;

          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} `,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [data, validationErrors],
  );

  //Column definitions
  const columns = useMemo<MRT_ColumnDef<taskEntity>[]>(
    () => [
      {

        accessorKey: 'key',

        header: 'KEY',

        enableColumnOrdering: false,

        enableEditing: false, //disable editing on this column

        enableSorting: false,        

        size: 80,

      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 140,
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 80,
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
          type: 'number'
        }),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
          type: 'email',
        }),
        Cell: ({ cell }) => (

            <Box

              sx={(theme) => ({

                backgroundColor:
                  cell.getValue<number>() === 0
                    ? theme.colors.yellow[8]
                    : cell.getValue<number>() === 1
                    ? theme.colors.green[8]
                   : cell.getValue<number>() === 2 ? 
                   theme.colors.gray[8] : 
                   theme.colors.red[8],

                borderRadius: '4px',

                color: '#fff',

                maxWidth: '9ch',

                padding: '4px',

              })}

            >

              {
             convertStatusToString(cell.getValue<number>())              
              }

            </Box>
          ),

        },      
    ],
    [getCommonEditTextInputProps],
  );

  return (
    <>
      <MantineReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            mantineTableHeadCellProps: {
              align: 'center',
            },
            size: 20,
          },
        }}
        columns={columns}
        data={data ?? []} //data is undefined on first render 
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        initialState={{ showColumnFilters: true, columnVisibility:{ key:false} }}
        manualFiltering
        manualPagination  
        manualSorting  
        mantineToolbarAlertBannerProps={
  
          isError
  
            ? {
  
                color: 'red',               
  
                children: 'Error loading data',
  
              }
  
            : undefined
  
        }
   
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}

        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Tooltip withArrow position="left" label="Edit">
              <ActionIcon onClick={() => table.setEditingRow(row)}>
                <IconEdit />
              </ActionIcon>
            </Tooltip>
            <Tooltip withArrow position="right" label="Delete">
              <ActionIcon color="red" onClick={() => handleDeleteRow(row)}>
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          </Box>
        )}

        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Tooltip withArrow label="Refresh Data">
    
              <ActionIcon onClick={() => refetch()}>
    
                <IconRefresh />
    
              </ActionIcon>
    
            </Tooltip>
            <Button
            color="teal"
            onClick={() => setCreateModalOpen(true)}
            variant="filled"
          >
            Create New Task
          </Button>
          </Box>
        )}
  
        rowCount={data?.length ?? 0}
  
        state={{  
          isLoading,  
  
          showAlertBanner: isError,
  
          showProgressBars: isFetching,
        }}

      />
      <NewTaskModal
        data={data ?? []}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};