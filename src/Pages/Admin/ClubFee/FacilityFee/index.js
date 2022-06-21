import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import { Alert, Box, Button, Grid, Snackbar, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import EditFee from '../EditFee/EditFee';

const _facilityList = [
    {
        name: 'Giáp đầu',
        category: 'Giáp',
        quantity: 10,
        price: 500000,
    },
    {
        name: 'Đồ long đao',
        category: 'Vũ khí',
        quantity: 10,
        price: 500000,
    },
    {
        name: 'Ỷ thiên kiếm',
        category: 'Vũ khí',
        quantity: 10,
        price: 500000,
    },
    {
        name: 'Giáp chim',
        category: 'Giáp',
        quantity: 10,
        price: 500000,
    },
    {
        name: 'Giáp ngực',
        category: 'Giáp',
        quantity: 10,
        price: 500000,
    },
];

function FacilityFee() {
    const [facilityList, setFacilityList] = useState(_facilityList);
    const [pageSize, setPageSize] = useState(10);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const [editDialog, setEditDialog] = useState({
        message: '',
        isLoading: false,
        params: -1,
    });

    let snackBarStatus;
    console.log(facilityList);

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
                        onClick={() => toggleStatus(true)}
                        style={{ backgroundColor: 'aquamarine' }}
                    >
                        Chấp nhận
                    </Button>,
                    <Button
                        component="button"
                        label="Đã đóng"
                        onClick={() => toggleStatus(false)}
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
        container['id'] = index + 1;
        container['name'] = item.name;
        container['category'] = item.category;
        container['quantity'] = item.quantity;
        container['price'] = item.price;
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

    const toggleStatus = (flag) => {
        // console.log(id);
        // const newUserList = facilityList.map((facility) => {
        //     return facility.studentId === id ? { ...facility, active: !facility.active } : facility;
        // });
        // console.log(newUserList);
        // setFacilityList(newUserList);
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

            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                Xác nhận mua cơ sở vật chất
            </Typography>

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
