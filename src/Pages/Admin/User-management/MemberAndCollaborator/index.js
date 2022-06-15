import { Fragment, useEffect, useState, useCallback } from 'react';
import userApi from 'src/api/userApi';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
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

const fileTypes = ['CSV', 'JPG', 'png'];

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
    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'name', headerName: 'Tên', flex: 1 },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
            renderCell: (params) => <Link href={`mailto:${params.value}`}>{params.value.toString()}</Link>,
            flex: 1,
        },

        { field: 'gender', headerName: 'Giới tính', flex: 0.5 },
        { field: 'studentId', headerName: 'Mã sinh viên', width: 150, flex: 1 },
        { field: 'role', headerName: 'Vai trò', width: 200, flex: 1.5 },
        { field: 'active', headerName: 'Trạng thái', flex: 0.5 },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
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
        alert('navigation');
    };

    const onSubmit = (data) => {
        console.log(data);
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
                        utf8WithBom: true,
                    }}
                />
            </GridToolbarContainer>
        );
    }
    return (
        <Fragment>
            <Dialog open={openUploadFile} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle>Tải lên file CSV</DialogTitle>
                <Box component="form">
                    <DialogContent>
                        <DragDrop />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Từ chối</Button>
                        <Button onClick={handleClose}>Đồng ý</Button>
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
                <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={handleClickOpen}>
                    Thêm danh sách thành viên
                </Button>
            </Box>
            <div style={{ height: '70vh', width: '100%' }}>
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
            </div>
        </Fragment>
    );
}

export default MemberAndCollaborator;
