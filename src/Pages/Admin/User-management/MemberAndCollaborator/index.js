import { Fragment, useEffect, useState, useCallback } from 'react';
import userApi from 'src/api/userApi';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { Alert, Box, Button, Snackbar, styled } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useNavigate } from 'react-router-dom';
import { Link as routerLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from '@mui/material/Typography';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import styles from './MemberAndCollaborator.module.scss';
import { FileUploader } from 'react-drag-drop-files';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import clsx from 'clsx';
import axios from 'axios';

const fileTypes = ['CSV', 'JPG', 'png'];
const Input = styled('input')({
    display: 'none',
});
function DragDrop() {
    const [aFile, setAFile] = useState(null);

    const handleChange = async (file) => {
        setAFile(file);
        // await userApi.uploadCSV(aFile).then((res) => {
        //     console.log('1', res);
        //     console.log('2', res.data);
        //     if (res.data.length != 0) {
        //         // setSnackBarStatus(true);
        //     } else {
        //         console.log('huhu');
        //         // setSnackBarStatus(false);
        //     }
        // });
    };

    useEffect(() => {
        console.log(aFile);
    }, [aFile]);

    return (
        <div className="dragdrop">
            <FileUploader
                multiple={true}
                onTypeError={(err) => console.log(err)}
                name="file"
                types={fileTypes}
                handleChange={handleChange}
            />
            <p>{aFile ? `File name: ${aFile[0].name}` : ''}</p>
        </div>
    );
}

function MemberAndCollaborator() {
    const [userList, setUserList] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [openUploadFile, setOpenUploadFile] = useState(false);

    const handleClickOpen = () => {
        setOpenUploadFile(true);
    };

    const handleClose = () => {
        setOpenUploadFile(false);
    };

    useEffect(() => {
        fetchUserList();
    }, []);

    const fetchUserList = async () => {
        try {
            const response = await userApi.getAll();
            console.log(response);
            setUserList(response.data);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        // resolver: yupResolver(validationSchema),
        // mode: 'onBlur',
    });
    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'name', headerName: 'Tên', flex: 0.8 },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
            renderCell: (params) => <Link href={`mailto:${params.value}`}>{params.value.toString()}</Link>,
            flex: 1,
        },

        { field: 'gender', headerName: 'Giới tính', flex: 0.5 },
        { field: 'studentId', headerName: 'Mã sinh viên', width: 150, flex: 0.6 },
        { field: 'role', headerName: 'Vai trò', width: 200, flex: 1.2 },
        {
            field: 'active',
            headerName: 'Trạng thái',
            flex: 0.5,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('status-rows', {
                    active: params.value === 'Active',
                    deactive: params.value === 'Deactive',
                });
            },
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 0.5,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />} label="Chỉnh sửa" onClick={editUser(params.row.studentId)} />,
                <GridActionsCellItem
                    icon={<SecurityIcon />}
                    label="Chuyển trạng thái"
                    onClick={toggleStatus(params.row.studentId)}
                />,
            ],
        },
    ];

    const rowsUser = userList.map((item, index) => {
        const container = {};
        container['id'] = index + 1;
        container['name'] = item.name;
        container['email'] = item.email;
        container['gender'] = item.gender ? 'Nam' : 'Nữ';
        container['studentId'] = item.studentId;
        container['role'] = item.role.name;
        container['active'] = item.active ? 'Active' : 'Deactive';

        return container;
    });

    // const [rows, setRows] = useState();
    // setRows(rowsUser);

    const editUser = useCallback(
        (studentId) => () => {
            setTimeout(() => {
                // setRows((prevRows) => prevRows.filter((row) => row.id !== id));
                console.log(studentId);
                let path = `${studentId}/edit`;
                navigate(path);
            });
        },
        [],
    );
    const toggleStatus = useCallback(
        (id) => () => {
            // fetchUserList();
            console.log(id.active);
            const params = { studentId: id };
            userApi.updateUserStatus(params).then((res) => {
                setUserList((oldUserList) => {
                    return oldUserList.map((user) => {
                        if (user.studentId === id) {
                            console.log(user.studentId, id);
                            return { ...user, active: !user.active };
                        }
                        return user;
                    });
                });
                console.log('1', res);
                console.log('2', res.data);
            });
        },
        [],
    );

    let navigate = useNavigate();

    const handleOnClick = (rowData) => {
        console.log('push -> /roles/' + rowData.studentId);
        let path = `${rowData.studentId}`;
        navigate(path);
        // alert('navigation');
    };
    const [openSnackBar, setOpenSnackBar] = useState(false);
    let snackBarStatus;
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
    const onSubmit = (data) => {
        let formData = new FormData();
        formData.append('file', data.file[0]);
        axios
            .post('https://capstone-project-macm.herokuapp.com/api/admin/hr/users/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => {
                console.log(res);
                if (res.data.length != 0) {
                    setOpenSnackBar(true);
                    // setSnackBarStatus(true);
                    snackBarStatus = true;
                    dynamicAlert(snackBarStatus, res.data.message);
                } else {
                    console.log('huhu');
                    setOpenSnackBar(true);
                    // setSnackBarStatus(false);
                    snackBarStatus = false;
                    dynamicAlert(snackBarStatus, res.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const exportExcel = () => {
        console.log('exportExcel');
        axios({
            url: 'https://capstone-project-macm.herokuapp.com/api/admin/hr/users/export', //your url
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'hahahaahahah.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
        // userApi.exportUserListToExcel({ responseType: 'blob' }).then((res) => {
        //     const url = window.URL.createObjectURL(new Blob([res.data]));
        //     const link = document.createElement('a');
        //     link.href = url;
        //     link.setAttribute('download', 'users.xlsx'); //or any other extension
        //     document.body.appendChild(link);
        //     link.click();
        // });
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
                {/* <GridToolbarExport
                    csvOptions={{
                        fileName: 'Danh sách thành viên và cộng tác viên',
                        utf8WithBom: true,
                    }}
                /> */}
            </GridToolbarContainer>
        );
    }

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
            <Dialog open={openUploadFile} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle>Tải lên file Excel</DialogTitle>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="outlined" component="span" sx={{ mr: 1 }} onClick={exportExcel}>
                            Tải File mẫu
                        </Button>
                        {/* <label htmlFor="contained-button-file">
                            <Input accept=".xlsx" id="contained-button-file" multiple type="file" />
                            <Button variant="contained" component="span">
                                Upload
                            </Button>
                        </label> */}
                        <input type="file" accept=".xlsx" {...register('file')} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Từ chối</Button>
                        <Button type="submit">Đồng ý</Button>
                    </DialogActions>
                </Box>
            </Dialog>
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                Quản lý Thành viên và Cộng tác viên
            </Typography>
            <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="outlined"
                    sx={{ marginRight: 2 }}
                    component={routerLink}
                    to={'/admin/addUser'}
                    startIcon={<AddCircleIcon />}
                >
                    Thêm thành viên
                </Button>
                <Button
                    variant="outlined"
                    sx={{ marginRight: 2 }}
                    startIcon={<UploadFileIcon />}
                    onClick={handleClickOpen}
                >
                    Thêm danh sách thành viên
                </Button>
                <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} onClick={exportExcel}>
                    Xuất File Excel
                </Button>
            </Box>
            {/* <div style={{ height: '70vh', width: '100%' }}> */}
            <Box
                sx={{
                    height: '70vh',
                    width: '100%',
                    '& .status-rows': {
                        justifyContent: 'center !important',
                        minHeight: '0px !important',
                        maxHeight: '35px !important',
                        borderRadius: '100px',
                        position: 'relative',
                        top: '9px',
                        minWidth: '104.143px !important',
                    },
                    '& .status-rows.active': {
                        backgroundColor: '#56f000',
                        color: '#fff',
                        fontWeight: '600',
                        textAlign: 'center',
                    },
                    '& .status-rows.deactive': {
                        backgroundColor: '#ff3838',
                        color: '#fff',
                        fontWeight: '600',
                    },
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
                    components={{
                        Toolbar: CustomToolbar,
                    }}
                />
            </Box>
            {/* </div> */}
        </Fragment>
    );
}

export default MemberAndCollaborator;
