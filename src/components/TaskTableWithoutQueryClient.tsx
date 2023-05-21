import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskEntity } from './taskEntity';
import { NewTaskModal } from './NewTaskModal';
import { taskValidation } from './taskValidation';
import { convertStatusToString } from './convertStatusToString';
import { getStatusColor } from './getStatusColor';
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
  MaterialReactTableProps,
} from 'material-react-table';
import { Box, Tooltip, Button, MenuItem, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';

//Url for my test API
const apiUrl = 'http://localhost:5260';

//Creates MainTable
export const TaskTableWithoutQueryClient = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  //fetch data using GET
  const { data, isError, isFetching, isLoading, refetch } = useQuery<
    taskEntity[]
  >({
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
  const addOrEditTask = (task: taskEntity) => {
    const fetchURL = new URL('/Task', apiUrl);

    fetch(fetchURL.href, {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(task),
    }).then(() => {
      refetch();
    });
  };

  const handleSaveRowEdits: MaterialReactTableProps<taskEntity>['onEditingRowSave'] =
    async ({ exitEditingMode, values }) => {
      if (!Object.keys(validationErrors).length) {
        addOrEditTask(values);
        exitEditingMode(); //required to exit editing mode and close modal
      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = (row: MRT_Row<taskEntity>) => {
    if (
      !window.confirm(
        `Are you sure you want to delete Task named: ${row.getValue('name')}`,
      )
    ) {
      return;
    }

    const fetchURL = new URL('/Task', apiUrl);
    fetchURL.searchParams.set('key', row.getValue('key'));

    fetch(fetchURL.href, { method: 'DELETE' }).then(() => {
      refetch();
    });
  };

  //used for validation
  const getCommonEditTextInputProps = useCallback(
    (
      cell: MRT_Cell<taskEntity>,
    ): MRT_ColumnDef<taskEntity>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],

        onBlur: (event) => {
          const validation =
            cell.column.id === 'name'
              ? taskValidation(
                  data?.filter(
                    (task) => task.key !== cell.row.getValue('key'),
                  ) ?? [],
                  event.target.value,
                )
              : [true, undefined];
          if (!validation[0]) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${validation[1]} `,
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
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
          type: 'number',
        }),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 80,
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown

          children: [0, 1, 2].map((status) => (
            <MenuItem key={status} value={status}>
              {convertStatusToString(status)}
            </MenuItem>
          )),
        },

        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor: getStatusColor(cell.getValue<number>(), theme),

              borderRadius: '4px',

              color: '#fff',

              maxWidth: '9ch',

              padding: '4px',
            })}
          >
            {convertStatusToString(cell.getValue<number>())}
          </Box>
        ),
      },
    ],
    [getCommonEditTextInputProps],
  );

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
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
        initialState={{
          showColumnFilters: true,
          columnVisibility: { key: false },
        }}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: 'error',

                children: 'Error loading data',
              }
            : undefined
        }
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>

            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Tooltip arrow placement="left" title="Refresh Data">
              <IconButton onClick={() => refetch()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              color="secondary"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
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
