import { Fragment, useEffect, useState, useCallback } from 'react';
import userApi from 'src/api/userApi';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useNavigate } from 'react-router-dom';
// import Link from '@mui/material/Link';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';

function MemberAndCollaborator() {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await userApi.getAllAdmin();
                console.log(response);
                setUserList(response.data);
            } catch (error) {
                console.log('Failed to fetch user list: ', error);
            }
        };
        fetchUserList();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'name', headerName: 'Tên', width: 220 },
        // {
        //     field: 'id',
        //     headerName: 'test link',
        //     width: 220,
        //     renderCell: (params) => <Link href={`/admin/member/${params.value}`}>{params.value.toString()}</Link>,
        // },

        { field: 'gender', headerName: 'Giới tính' },
        { field: 'studentId', headerName: 'Mã sinh viên', width: 150 },
        { field: 'role', headerName: 'Vai trò', width: 200 },
        {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Delete"
                    onClick={() => {
                        alert('delete');
                    }}
                />,
                <GridActionsCellItem
                    icon={<SecurityIcon />}
                    label="Chuyển trạng thái"
                    // onClick={toggleAdmin(params.id)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Xóa"
                    // onClick={duplicateUser(params.id)}
                    showInMenu
                />,
            ],
        },
    ];

    const rows = userList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['name'] = item.name;
        container['gender'] = item.gender ? 'Nam' : 'Nữ';
        container['studentId'] = item.studentId;
        container['role'] = item.role.name;

        return container;
    });

    // const deleteUser = (ids) => {
    //     const selectedIDs = new Set(ids);
    //     const selectedRows = rows.filter((row) => selectedIDs.has(row.id));

    //     setSelectedRows(selectedRows);
    //     console.log(selectedRows);
    // };

    let navigate = useNavigate();

    const handleOnClick = (rowData) => {
        console.log('push -> /roles/' + rowData.studentId);
        let path = `${rowData.studentId}`;
        navigate(path);
        alert('navigation');
    };
    function CustomToolbar() {
        return (
            <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
                <Box
                    sx={{
                        p: 0.5,
                        pb: 0,
                    }}
                >
                    <GridToolbarQuickFilter />
                </Box>
                <GridToolbarExport
                    csvOptions={{
                        fileName: 'Danh sách thành viên và cộng tác viên',
                        delimiter: ';',
                        utf8WithBom: true,
                    }}
                />
            </GridToolbarContainer>
        );
    }
    // function QuickSearchToolbar() {
    //     return (

    //     );
    // }
    return (
        <Fragment>
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 5 }}>
                Quản lý Ban chủ nhiệm
            </Typography>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    disableSelectionOnClick={true}
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onCellDoubleClick={(param) => {
                        handleOnClick(param.row);
                    }}
                    components={{
                        Toolbar: CustomToolbar,
                        // Toolbar: QuickSearchToolbar,
                    }}
                />
            </div>
        </Fragment>
    );
}

export default MemberAndCollaborator;
