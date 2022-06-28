import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Snackbar,
    Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import facilityApi from 'src/api/facilityApi';

function FacilityFee() {
    const [facilityList, setFacilityList] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [isApprove, setIsApprove] = useState(false);
    const [idUpdate, setIdUpdate] = useState(0);
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    let navigate = useNavigate();

    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };

    let snackBarStatus;

    const fetchRequestToBuyFacility = async () => {
        try {
            const response = await facilityApi.getAllRequest();
            console.log(response);
            const newUser = response.data.filter((user) => user.status === 'Đang chờ duyệt');
            console.log(newUser);
            setFacilityList(newUser);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        fetchRequestToBuyFacility();
    }, []);

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleOpenDialog = (id, isApprove) => {
        setIsApprove(isApprove);
        setIdUpdate(id);
        setOpenDialog(true);
    };

    const columns = [
        { field: 'name', headerName: 'Tên cơ sở vật chất', flex: 0.8 },
        { field: 'category', headerName: 'Loại', width: 150, flex: 0.6 },
        { field: 'quantity', headerName: 'Số lượng', width: 150, flex: 0.6 },
        { field: 'price', headerName: 'Đơn giá', width: 150, flex: 0.6 },
        {
            field: 'actions',
            type: 'actions',
            width: 100,
            flex: 0.5,
            cellClassName: 'actions',
            getActions: (params) => {
                return [
                    <Button
                        component="button"
                        label="Đã đóng"
                        onClick={() => handleOpenDialog(params.row.id, true)}
                        style={{ backgroundColor: 'aquamarine' }}
                    >
                        Chấp nhận
                    </Button>,
                    <Button
                        component="button"
                        label="Đã đóng"
                        onClick={() => handleOpenDialog(params.row.id, false)}
                        style={{ backgroundColor: 'lightcoral' }}
                    >
                        Từ chối
                    </Button>,
                ];
            },
        },
    ];

    const rowsFacility = facilityList.map((item, index) => {
        const container = {};
        container['id'] = item.id;
        container['name'] = item.facilityName;
        container['category'] = item.facilityCategory;
        container['quantity'] = item.quantity;
        container['price'] = item.unitPrice;
        return container;
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({});

    const onSubmit = (userList) => {
        console.log(userList);
    };

    const acceptRequest = async (facilityId) => {
        try {
            const response = await facilityApi.approveRequestToBuyFacility(facilityId);
            setOpenSnackBar(true);
            snackBarStatus = true;
            dynamicAlert(snackBarStatus, response.message);
        } catch (error) {
            console.log('Khong the chap thuan yeu cau nay, loi:', error);
            setOpenSnackBar(true);
            snackBarStatus = true;
            dynamicAlert(snackBarStatus, 'Khong the chap thuan yeu cau nay');
        }
    };

    const declineRequest = async (facilityId) => {
        try {
            const response = await facilityApi.declineRequestToBuyFacility(facilityId);
            setOpenSnackBar(true);
            snackBarStatus = true;
            dynamicAlert(snackBarStatus, response.message);
        } catch (error) {
            console.log('Khong the chap thuan yeu cau nay, loi:', error);
            setOpenSnackBar(true);
            snackBarStatus = true;
            dynamicAlert(snackBarStatus, 'Khong the chap thuan yeu cau nay');
        }
    };
    const handleUpdate = () => {
        console.log(idUpdate, isApprove);
        if (isApprove) {
            acceptRequest(idUpdate);
        } else {
            declineRequest(idUpdate);
        }

        const newUser = facilityList.filter((user) => user.id !== idUpdate);
        setFacilityList(newUser);

        handleCloseDialog();
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
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Xác nhận</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Bạn có muốn lưu các thay đổi ?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Từ chối</Button>
                    <Button onClick={handleUpdate} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
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

            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                Xác nhận mua cơ sở vật chất
            </Typography>
            <Button variant="contained" color="success">
                <Link to={`./report`} style={{ color: 'white' }}>
                    Lịch sử duyệt mua cơ sở vật chất
                </Link>
            </Button>
            <Box sx={{ height: 500 }}>
                <DataGrid
                    loading={!facilityList.length}
                    disableSelectionOnClick={true}
                    rows={rowsFacility}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 20, 30]}
                    components={{
                        Toolbar: CustomToolbar,
                    }}
                />
            </Box>
            <Button type="submit">Đồng ý</Button>
        </Fragment>
    );
}

export default FacilityFee;
