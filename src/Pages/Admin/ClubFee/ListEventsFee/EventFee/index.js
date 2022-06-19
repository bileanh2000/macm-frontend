import React, { Fragment, useState } from 'react';
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import { Alert, Box, Button, Grid, Snackbar, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import EditFee from 'src/Pages/Admin/ClubFee/EditFee/EditFee';
import { useLocation } from 'react-router-dom';

const _userList = [
    {
        name: 'Pham Minh Duc',
        studentId: 'HE123456',
        active: true,
    },
    {
        name: 'Duong Thanh Tung',
        studentId: 'HE456789',
        active: false,
    },
    {
        name: 'Dam Van Toan',
        studentId: 'HE987654',
        active: true,
    },
    {
        name: 'Le Hoang Nhat Linh',
        studentId: 'HE654321',
        active: false,
    },
    {
        name: 'Le Anh Tuan',
        studentId: 'HE147258',
        active: true,
    },
];
function EventFee() {
    const [userList, setUserList] = useState(_userList);
    const [cost, setCost] = useState(100000);
    const [pageSize, setPageSize] = useState(10);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const [editDialog, setEditDialog] = useState({
        message: '',
        isLoading: false,
        params: -1,
    });
    const location = useLocation();
    const _event = location.state?.event;
    const [event, setEvent] = useState(_event);
    console.log(event);

    const handleEditDialog = (message, isLoading, params) => {
        setEditDialog({
            message,
            isLoading,
            params,
        });
    };

    const handleEdit = (params) => {
        handleEditDialog('Chỉnh sửa tiền phí', true, params);
    };

    const areUSureEdit = (choose, params) => {
        if (choose) {
            console.log('get-', params);
            event.fee = +params;
            setEvent(event);
            dynamicAlert(true, 'Cập nhật thành công');
            setOpenSnackBar(true);
            handleEditDialog('', false, -1);
        } else {
            handleEditDialog('', false, -1);
        }
    };

    let attendance = userList.reduce((attendaceCount, user) => {
        return user.active ? attendaceCount + 1 : attendaceCount;
    }, 0);

    let snackBarStatus;

    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'name', headerName: 'Tên', flex: 0.8 },
        { field: 'studentId', headerName: 'Mã sinh viên', width: 150, flex: 0.6 },
        {
            field: 'active',
            headerName: 'Trạng thái',
            flex: 0.5,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('status-rows', {
                    active: params.value === 'Đã đóng',
                    deactive: params.value === 'Chưa đóng',
                });
            },
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Đã đóng - Chưa đóng',
            width: 100,
            flex: 0.5,
            cellClassName: 'actions',
            getActions: (params) => {
                if (params.row.active == 'Đã đóng') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonChecked />}
                            label="Đã đóng"
                            onClick={() => toggleStatus(params.row.studentId)}
                            color="primary"
                            aria-details="Đã đóng"
                        />,
                        <GridActionsCellItem
                            icon={<RadioButtonUnchecked />}
                            label="Chưa đóng"
                            onClick={() => toggleStatus(params.row.studentId)}
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<RadioButtonUnchecked />}
                        label="Đã đóng"
                        onClick={() => toggleStatus(params.row.studentId)}
                    />,
                    <GridActionsCellItem
                        icon={<RadioButtonChecked />}
                        label="Chưa đóng"
                        onClick={() => toggleStatus(params.row.studentId)}
                        color="primary"
                    />,
                ];
            },
        },
    ];

    const rowsUser = userList.map((item, index) => {
        const container = {};
        container['id'] = index + 1;
        container['name'] = item.name;
        container['studentId'] = item.studentId;
        container['active'] = item.active ? 'Đã đóng' : 'Chưa đóng';
        return container;
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        // resolver: yupResolver(validationSchema),
        // mode: 'onBlur',
    });

    const onSubmit = (userList) => {
        console.log(userList);
    };

    const toggleStatus = (id) => {
        console.log(id);
        const newUserList = userList.map((user) => {
            return user.studentId === id ? { ...user, active: !user.active } : user;
        });
        console.log(newUserList);
        setUserList(newUserList);
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

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                        Quản lý chi phí sự kiện
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                        {event.title}
                        <Box sx={{ display: 'flex' }}>
                            <Typography variant="h6" sx={{ color: 'red', marginRight: 5 }}>
                                Số tiền : {event.fee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </Typography>
                            <Button startIcon={<Edit />} onClick={() => handleEdit(cost)}>
                                Chỉnh sửa phí
                            </Button>
                        </Box>
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h6" sx={{ float: 'right' }}>
                        Đã đóng: {attendance}/{userList.length}
                    </Typography>
                </Grid>
            </Grid>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
                            //minWidth: '104.143px !important',
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
                        // onCellDoubleClick={(param) => {
                        //     handleOnClick(param.row);
                        // }}
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                    />
                </Box>
                <Button type="submit">Đồng ý</Button>
            </Box>
            {editDialog.isLoading && (
                <EditFee
                    //Update
                    onDialog={areUSureEdit}
                    message={editDialog.message}
                    id={editDialog.params}
                />
            )}
        </Fragment>
    );
}

export default EventFee;
