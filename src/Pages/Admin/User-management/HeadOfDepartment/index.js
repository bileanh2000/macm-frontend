import { Fragment, useEffect, useState, useCallback } from 'react';
import userApi from 'src/api/userApi';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
} from '@mui/x-data-grid';

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
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'name', headerName: 'Tên', flex: 1 },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
            renderCell: (params) => <Link href={`mailto:${params.value}`}>{params.value.toString()}</Link>,
            flex: 2,
        },

        { field: 'gender', headerName: 'Giới tính', flex: 1 },
        { field: 'studentId', headerName: 'Mã sinh viên', flex: 1 },
        { field: 'role', headerName: 'Vai trò', flex: 1 },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Delete"
                    onClick={() => {
                        alert('delete');
                    }}
                />,

                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Xóa"
                    // onClick={deleteUser(params.id)}
                />,
            ],
        },
    ];

    const rows = userList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['name'] = item.name;
        container['email'] = item.email;
        container['gender'] = item.gender ? 'Nam' : 'Nữ';
        container['studentId'] = item.studentId;
        container['role'] = item.role.name;

        return container;
    });

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

    return (
        <Fragment>
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 5 }}>
                Quản lý Ban chủ nhiệm
            </Typography>
            <div style={{ height: '80vh', width: '100%' }}>
                <DataGrid
                    loading={!userList.length}
                    disableSelectionOnClick={true}
                    rows={rows}
                    columns={columns}
                    pageSize={15}
                    rowsPerPageOptions={[5]}
                    onCellDoubleClick={(param) => {
                        handleOnClick(param.row);
                    }}
                    components={{
                        Toolbar: CustomToolbar,
                    }}
                />
            </div>
        </Fragment>
    );
}

export default MemberAndCollaborator;
