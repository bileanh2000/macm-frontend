import { Fragment, useEffect, useState, useCallback } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Alert, Box, Button, MenuItem, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import { AddCircle, Edit, UploadFile } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import moment from 'moment';

import userApi from 'src/api/userApi';

function MemberInDepartment() {
    let navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [semester, setSemester] = useState('Summer2022');
    const [editable, setEditable] = useState(false);

    const fetchUserListBySemester = async (params) => {
        try {
            const response = await userApi.getAllUserBySemester(params);
            console.log(response);
            setUserList(response.data);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };
    const handleChange = (event) => {
        console.log(event.target.value);
        setSemester(event.target.value);
        if (event.target.value != 'Summer2022') {
            setEditable(true);
        } else {
            setEditable(false);
        }
        console.log(editable);
        // fetchUserListBySemester(semester);
    };

    useEffect(() => {
        fetchUserListBySemester(semester);
    }, [semester]);

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5, hide: true },
        { field: 'name', headerName: 'Tên', flex: 0.8 },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
            renderCell: (params) => <Link href={`mailto:${params.value}`}>{params.value.toString()}</Link>,
            flex: 1,
        },

        { field: 'gender', headerName: 'Giới tính', flex: 0.5 },
        { field: 'dateOfBirth', headerName: 'Ngày sinh', flex: 0.5 },
        { field: 'month', headerName: 'Tháng sinh', flex: 0.5, hide: true, hideable: false },
        { field: 'generation', headerName: 'Gen', flex: 0.5 },
        { field: 'studentId', headerName: 'Mã sinh viên', flex: 0.6 },
        { field: 'role', headerName: 'Vai trò', flex: 1.2 },
        {
            field: 'active',
            headerName: 'Trạng thái',
            renderCell: (cellValues) => {
                return (
                    <Button
                        sx={{
                            // borderRadius: '5px',
                            ...(cellValues.row.active === 'Active'
                                ? {
                                      backgroundColor: '#00AD31',
                                      boxShadow: 'none',
                                      '&:hover': {
                                          backgroundColor: '#008a27',
                                          boxShadow: 'none',
                                      },
                                      '&:active': {
                                          boxShadow: 'none',
                                          backgroundColor: '#008a27',
                                      },
                                  }
                                : {
                                      backgroundColor: '#ff3838',
                                      boxShadow: 'none',
                                      '&:hover': {
                                          backgroundColor: '#e53232',
                                          boxShadow: 'none',
                                      },
                                      '&:active': {
                                          boxShadow: 'none',
                                          backgroundColor: '#e53232',
                                      },
                                  }),
                        }}
                        variant="contained"
                        color="primary"
                    >
                        {cellValues.row.active}
                    </Button>
                );
            },
        },
        {
            hideable: !editable,
            hide: editable,
            field: 'actions',
            type: 'actions',
            flex: 0.5,
            getActions: (params) => [
                <GridActionsCellItem icon={<Edit />} label="Chỉnh sửa" onClick={editUser(params.row.studentId)} />,
            ],
        },
    ];
    const countActive = userList.filter((item) => {
        return item.active === true;
    }).length;

    console.log(countActive);
    const rowsUser = userList.map((item, index) => {
        const container = {};
        container['id'] = index + 1;
        container['name'] = item.name;
        container['email'] = item.email;
        container['gender'] = item.gender ? 'Nam' : 'Nữ';
        container['dateOfBirth'] = moment(new Date(item.dateOfBirth)).format('DD/MM/yyyy');
        container['generation'] = item.generation;
        container['month'] = new Date(item.dateOfBirth).getMonth() + 1;
        container['studentId'] = item.studentId;
        container['role'] = item.roleName;
        container['active'] = item.active ? 'Active' : 'Deactive';

        return container;
    });

    const editUser = useCallback(
        (studentId) => () => {
            setTimeout(() => {
                console.log(studentId);
                let path = `${studentId}/edit`;
                navigate(path);
            });
        },
        [],
    );

    const handleOnClick = (rowData) => {
        console.log('push -> /roles/' + rowData.studentId);
        let path = `${rowData.studentId}`;
        navigate(path);
        // alert('navigation');
    };
    const [openSnackBar, setOpenSnackBar] = useState(false);

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });

    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };

    return (
        <Fragment>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={5000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={handleCloseSnackBar}
                    variant="filled"
                    severity={customAlert.severity || 'success'}
                    sx={{ width: '100%' }}
                >
                    {customAlert.message}
                </Alert>
            </Snackbar>
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 4 }}>
                Quản lý Thành viên và Cộng tác viên
            </Typography>
            <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <TextField
                        id="outlined-select-currency"
                        size="small"
                        select
                        label="Chọn kỳ"
                        value={semester}
                        onChange={handleChange}
                    >
                        <MenuItem value="Summer2022">Summer 2022</MenuItem>
                        <MenuItem value="Spring2022">Spring 2022</MenuItem>
                    </TextField>
                </Box>
                <Box>
                    <Button
                        variant="outlined"
                        sx={{ marginRight: 2 }}
                        component={Link}
                        to={'/admin/addUser'}
                        startIcon={<AddCircle />}
                    >
                        Thêm thành viên
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ marginRight: 2 }}
                        component={Link}
                        to={'/admin/addUser'}
                        startIcon={<AddCircle />}
                    >
                        Thêm danh sách thành viên
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    height: '70vh',
                    width: '100%',
                }}
            >
                <DataGrid
                    loading={!userList.length}
                    disableSelectionOnClick={true}
                    rows={rowsUser}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 20, 30]}
                    onCellDoubleClick={(param) => {
                        handleOnClick(param.row);
                    }}
                />
            </Box>
            {/* </div> */}
        </Fragment>
    );
}

export default MemberInDepartment;
