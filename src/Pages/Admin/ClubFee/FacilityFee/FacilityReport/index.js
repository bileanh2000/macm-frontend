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
    FormControl,
    Grid,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import facilityApi from 'src/api/facilityApi';

function FacilityReport() {
    const [facilityList, setFacilityList] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [type, setType] = useState(0);
    let navigate = useNavigate();

    const handleChangeType = (event) => {
        setType(event.target.value);
        fetchRequestToBuyFacility(event.target.value);
    };

    const fetchRequestToBuyFacility = async (type) => {
        try {
            if (type === 0) {
                const response = await facilityApi.getAllRequest();
                console.log(response);
                const newUser = response.data.filter((user) => user.status !== 'Đang chờ duyệt');
                console.log(newUser);
                setFacilityList(newUser);
            } else if (type === 1) {
                const response = await facilityApi.getAllRequest();
                console.log(response);
                const newUser = response.data.filter((user) => user.status === 'Đã chấp nhận');
                console.log(newUser);
                setFacilityList(newUser);
            } else {
                const response = await facilityApi.getAllRequest();
                console.log(response);
                const newUser = response.data.filter((user) => user.status === 'Đã từ chối');
                console.log(newUser);
                setFacilityList(newUser);
            }
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        fetchRequestToBuyFacility(type);
    }, [type]);

    const columns = [
        { field: 'name', headerName: 'Tên cơ sở vật chất', flex: 0.8 },
        { field: 'category', headerName: 'Loại', width: 150, flex: 0.6 },
        { field: 'quantity', headerName: 'Số lượng', width: 150, flex: 0.6 },
        { field: 'price', headerName: 'Đơn giá', width: 150, flex: 0.6 },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 150,
            flex: 0.6,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }
                return clsx('status-rows', {
                    active: params.row.status === 'Đã chấp nhận',
                    deactive: params.row.status === 'Đã từ chối',
                });
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
        container['status'] = item.status;
        return container;
    });

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
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                Xác nhận mua cơ sở vật chất
            </Typography>
            <FormControl size="small">
                <Select id="demo-simple-select" value={type} displayEmpty onChange={handleChangeType}>
                    <MenuItem value={0}>Tất cả</MenuItem>
                    <MenuItem value={1}>Chấp thuận</MenuItem>
                    <MenuItem value={2}>Đã hủy</MenuItem>
                </Select>
            </FormControl>
            <Box
                sx={{
                    height: '70vh',
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
        </Fragment>
    );
}

export default FacilityReport;
