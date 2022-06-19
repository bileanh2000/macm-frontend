import { Alert, Box, Button, FormControlLabel, Radio, RadioGroup, Snackbar, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const _userList = [
    {
        name: 'Pham Minh Duc',
        studentId: 'HE123456',
        active: true
    },
    {
        name: 'Duong Thanh Tung',
        studentId: 'HE456789',
        active: false
    },
    {
        name: 'Dam Van Toan',
        studentId: 'HE987654',
        active: true
    },
    {
        name: 'Le Hoang Nhat Linh',
        studentId: 'HE654321',
        active: false
    },
    {
        name: 'Le Anh Tuan',
        studentId: 'HE147258',
        active: true
    }

]

function TakeAttendance() {
    const [userList, setUserList] = useState(_userList);
    const [pageSize, setPageSize] = useState(10);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    let attendance = userList.reduce((attendaceCount, user) => {
        return user.active ? attendaceCount + 1 : attendaceCount
    }, 0)


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

    useEffect(() => {
        //fetchUserList();
    }, []);

    // const fetchUserList = async () => {
    //     try {
    //         const response = await userApi.getAll();
    //         console.log(response);
    //         setUserList(response.data);
    //     } catch (error) {
    //         console.log('Failed to fetch user list: ', error);
    //     }
    // };


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
                    active: params.value === 'Có mặt',
                    deactive: params.value === 'Vắng mặt'
                });
            }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Có mặt - Vắng mặt',
            width: 100,
            flex: 0.5,
            cellClassName: 'actions',
            getActions: (params) => {
                if (params.row.active == 'Có mặt') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonChecked />}
                            label="Có mặt"
                            onClick={() => toggleStatus(params.row.studentId)}
                            color="primary"
                            aria-details='Có mặt'
                        />,
                        <GridActionsCellItem
                            icon={<RadioButtonUnchecked />}
                            label="Vắng mặt"
                            onClick={() => toggleStatus(params.row.studentId)}
                        />,
                    ]
                }
                return [
                    <GridActionsCellItem
                        icon={<RadioButtonUnchecked />}
                        label="Có mặt"
                        onClick={() => toggleStatus(params.row.studentId)}
                    />,
                    <GridActionsCellItem
                        icon={<RadioButtonChecked />}
                        label="Vắng mặt"
                        onClick={() => toggleStatus(params.row.studentId)}
                        color="primary"
                    />,
                ]

            },
        }
    ];

    const rowsUser = userList.map((item, index) => {
        const container = {};
        container['id'] = index + 1;
        container['name'] = item.name;
        container['studentId'] = item.studentId;
        container['active'] = item.active ? 'Có mặt' : 'Vắng mặt';
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

    // const toggleStatus = useCallback(
    //     (id) => () => {
    //         // fetchUserList();
    //         console.log(id.active);
    //         const params = { studentId: id };
    //         // userApi.updateUserStatus(params).then((res) => {
    //         //     setUserList((oldUserList) => {
    //         //         return oldUserList.map((user) => {
    //         //             if (user.studentId === id) {
    //         //                 console.log(user.studentId, id);
    //         //                 return { ...user, active: !user.active };
    //         //             }
    //         //             return user;
    //         //         });
    //         //     });
    //         //     console.log('1', res);
    //         //     console.log('2', res.data);
    //         // });
    //         console.log(id)
    //     },
    //     [],
    // );

    const toggleStatus = (id) => {
        console.log(id);
        const newUserList = userList.map((user) => {
            return user.studentId === id ? { ...user, active: !user.active } : user
        });
        console.log(newUserList);
        setUserList(newUserList)
    }


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
                Trạng thái điểm danh ngày: 16/06/2022
                <Typography variant='h6'>Số người tham gia hôm nay {attendance}/{userList.length}</Typography>
            </Typography>
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
        </Fragment>
    )
}

export default TakeAttendance