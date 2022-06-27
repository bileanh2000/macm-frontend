import { Alert, Box, Snackbar, Typography } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import adminAttendanceAPI from 'src/api/adminAttendanceAPI';

function ViewAttendance({ data }) {
    console.log(data);
    const [userList, setUserList] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [totalActive, setTotalActive] = useState();
    const [totalResult, setTotalResult] = useState();
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const location = useLocation();

    let _trainingScheduleId = location.state?.id;
    if (!_trainingScheduleId) _trainingScheduleId = data.trainingScheduleId;
    console.log(_trainingScheduleId);
    let _nowDate = location.state?.date;
    if (!_nowDate) _nowDate = data.date;
    console.log(_nowDate);
    const getAttendanceByStudentId = async () => {
        try {
            const response = await adminAttendanceAPI.getAttendanceByStudentId(_trainingScheduleId);
            console.log(response);
            setUserList(response.data);
            setTotalActive(response.totalActive);
            setTotalResult(response.totalResult);
        } catch (error) {
            console.log('Không thể lấy dữ liệu người dùng tham gia điểm danh. Error: ', error);
        }
    };

    useEffect(() => {
        getAttendanceByStudentId();
    }, []);

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
        { field: 'id', headerName: 'Số thứ tự', flex: 0.5 },
        { field: 'name', headerName: 'Tên', flex: 0.8 },
        { field: 'studentId', headerName: 'Mã sinh viên', width: 150, flex: 0.6 },
        {
            field: 'status',
            headerName: 'Trạng thái',
            flex: 0.5,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }
                return clsx('status-rows', {
                    active: params.value === 'Có mặt',
                    deactive: params.value === 'Vắng mặt',
                });
            },
        },
    ];

    const rowsUser = userList.map((item, index) => {
        const container = {};
        container['id'] = index + 1;
        container['name'] = item.name;
        container['studentId'] = item.studentId;
        container['status'] = item.status ? 'Có mặt' : 'Vắng mặt';
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
                Trạng thái điểm danh ngày: {_nowDate}
                <Typography variant="h6">
                    Số người tham gia hôm nay {totalActive}/{totalResult}
                </Typography>
            </Typography>
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
                    components={{
                        Toolbar: CustomToolbar,
                    }}
                />
            </Box>
        </Fragment>
    );
}

export default ViewAttendance;
