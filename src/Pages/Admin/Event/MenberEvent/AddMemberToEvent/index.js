import React, { useState } from 'react';
import { Box } from '@mui/system';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Typography,
} from '@mui/material';
import eventApi from 'src/api/eventApi';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
let snackBarStatus;

function AddMemberToEvent() {
    const [pageSize, setPageSize] = useState(30);
    const [memberList, setMemberList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let { id } = useParams();

    const fetchListMemberToAdd = async () => {
        try {
            const response = await eventApi.getAllMemberNotJointEvent(id);
            setMemberList(response.data);
            console.log('MemberNotJoin:', response.data);
        } catch (error) {
            console.log('failed at fetchListMemberToAdd', error);
        }
    };

    useEffect(() => {
        fetchListMemberToAdd(id);
    }, [id]);

    const columns = [
        { field: 'studentName', headerName: 'Tên', flex: 0.8 },
        { field: 'email', headerName: 'Email', flex: 1 },
        {
            field: 'studentId',
            headerName: 'Mã sinh viên',
            width: 150,
            flex: 0.6,
        },
        { field: 'roleInClub', headerName: 'Vai trò trong CLB', width: 150, flex: 1 },
        // { field: 'role', headerName: 'Vai trò trong sự kiện', width: 150, flex: 1 },
        // {
        //     field: 'attendanceStatus',
        //     headerName: 'Trạng thái',
        //     flex: 0.5,
        //     renderCell: (cellValues) => {
        //         return (
        //             <Button
        //                 Continue
        //                 sx={{
        //                     // borderRadius: '5px',
        //                     ...(cellValues.row.attendanceStatus === 'Đã đăng kí'
        //                         ? {
        //                               backgroundColor: '#00AD31',
        //                               boxShadow: 'none',
        //                               width: '112px',
        //                               '&:hover': {
        //                                   backgroundColor: '#00AD31',
        //                                   boxShadow: 'none',
        //                               },
        //                               '&:active': {
        //                                   boxShadow: 'none',
        //                                   backgroundColor: '#00AD31',
        //                               },
        //                           }
        //                         : {
        //                               backgroundColor: '#ff3838',
        //                               boxShadow: 'none',
        //                               width: '112px',
        //                               '&:hover': {
        //                                   backgroundColor: '#ff3838',
        //                                   boxShadow: 'none',
        //                               },
        //                               '&:active': {
        //                                   boxShadow: 'none',
        //                                   backgroundColor: '#ff3838',
        //                               },
        //                           }),
        //                 }}
        //                 variant="contained"
        //                 color="primary"
        //                 // onClick={(event) => {
        //                 //     handleUpdateStatus(cellValues.row.studentId);
        //                 // }}
        //                 // onClick={(event) => {
        //                 //     toggleStatus(cellValues.row.studentId);
        //                 // }}
        //             >
        //                 {cellValues.row.attendanceStatus}
        //             </Button>
        //         );
        //     },
        // },
        // {
        //     field: 'paymentStatus',
        //     headerName: 'Đóng tiền',
        //     flex: 0.5,
        //     renderCell: (cellValues) => {
        //         return (
        //             <Button
        //                 sx={{
        //                     // borderRadius: '5px',
        //                     ...(cellValues.row.paymentStatus === 'Đã đóng'
        //                         ? {
        //                               backgroundColor: '#00AD31',
        //                               boxShadow: 'none',
        //                               width: '112px',
        //                               '&:hover': {
        //                                   backgroundColor: '#00AD31',
        //                                   boxShadow: 'none',
        //                               },
        //                               '&:active': {
        //                                   boxShadow: 'none',
        //                                   backgroundColor: '#00AD31',
        //                               },
        //                           }
        //                         : {
        //                               backgroundColor: '#ff3838',
        //                               boxShadow: 'none',
        //                               width: '112px',
        //                               '&:hover': {
        //                                   backgroundColor: '#ff3838',
        //                                   boxShadow: 'none',
        //                               },
        //                               '&:active': {
        //                                   boxShadow: 'none',
        //                                   backgroundColor: '#ff3838',
        //                               },
        //                           }),
        //                 }}
        //                 variant="contained"
        //                 color="primary"
        //             >
        //                 {cellValues.row.paymentStatus}
        //             </Button>
        //         );
        //     },
        // },
    ];
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };

    const rowsUser =
        memberList &&
        memberList.map((item, index) => {
            const container = {};
            container['id'] = item.userId;
            container['studentName'] = item.userName;
            container['email'] = item.userMail;
            container['studentId'] = item.userStudentId;
            container['attendanceStatus'] = item.attendanceStatus ? 'Đã đăng kí' : 'Đã hủy';
            container['roleInClub'] = item.roleInClub;
            // container['paymentStatus'] = item.paymentStatus ? 'Đã đóng' : 'Chưa đóng';
            return container;
        });
    useEffect(() => {
        console.log(selectedRows);
    }, [selectedRows]);
    const addMemberToEvent = () => {
        eventApi.updateMemberToJoinEvent(id, selectedRows).then((res) => {
            console.log(res);
            if (res.data !== 0) {
                setOpenSnackBar(true);
                // setSnackBarStatus(true);
                snackBarStatus = true;
                dynamicAlert(snackBarStatus, res.message);
                const selectedIDs = new Set(selectionModel);
                setMemberList((prev) => prev.filter((item) => !selectedIDs.has(item.userId)));
                handleClose();
            }
        });
        // console.log(selectedRows);
        // console.log('addMemberToEvent', selectedRows);
    };

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
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
    const StyledGridOverlay = styled('div')(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        '& .ant-empty-img-1': {
            fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
        },
        '& .ant-empty-img-2': {
            fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
        },
        '& .ant-empty-img-3': {
            fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
        },
        '& .ant-empty-img-4': {
            fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
        },
        '& .ant-empty-img-5': {
            fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
            fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
        },
    }));
    function CustomNoRowsOverlay() {
        return (
            <StyledGridOverlay>
                <svg width="120" height="100" viewBox="0 0 184 152" aria-hidden focusable="false">
                    <g fill="none" fillRule="evenodd">
                        <g transform="translate(24 31.67)">
                            <ellipse className="ant-empty-img-5" cx="67.797" cy="106.89" rx="67.797" ry="12.668" />
                            <path
                                className="ant-empty-img-1"
                                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                            />
                            <path
                                className="ant-empty-img-2"
                                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                            />
                            <path
                                className="ant-empty-img-3"
                                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                            />
                        </g>
                        <path
                            className="ant-empty-img-3"
                            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                        />
                        <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                        </g>
                    </g>
                </svg>
                <Box sx={{ mt: 1 }}>Danh sách trống</Box>
            </StyledGridOverlay>
        );
    }

    return (
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
                },
                '& .status-rows.active': {
                    backgroundColor: '#56f000',
                    color: '#fff',
                    fontWeight: '600',
                    textAlign: 'center',
                    // minWidth: '80px !important',
                },
                '& .status-rows.deactive': {
                    backgroundColor: '#ff3838',
                    color: '#fff',
                    fontWeight: '600',
                    // minWidth: '80px !important',
                },
            }}
        >
            <Snackbar
                open={openSnackBar}
                autoHideDuration={5000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Xác nhận thêm thành viên vào sự kiện?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {selectedRows && selectedRows.map((item) => '"' + item.userName + '"' + ', ')} sẽ được thêm vào
                        sự kiện?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Từ chối</Button>
                    <Button onClick={addMemberToEvent} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
            <Typography variant="h4" sx={{ fontWeight: 500, marginBottom: 2 }}>
                Thêm thành viên vào sự kiện
            </Typography>

            <DataGrid
                // loading={data.length === 0}
                rows={rowsUser}
                checkboxSelection
                onSelectionModelChange={(ids) => {
                    setSelectionModel(ids);
                    const selectedIDs = new Set(ids);
                    const selectedRows = memberList && memberList.filter((row) => selectedIDs.has(row.userId));
                    setSelectedRows(selectedRows);
                    // console.log(selectedRows);
                    console.log('addMemberToEvent', selectedRows);
                }}
                // disableSelectionOnClick={true}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[30, 40, 50]}
                components={{
                    Toolbar: CustomToolbar,
                    NoRowsOverlay: CustomNoRowsOverlay,
                }}
            />
            {/* <pre style={{ fontSize: 10 }}>{JSON.stringify(selectedRows, null, 4)}</pre> */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={handleClickOpen}
                    disabled={selectionModel.length === 0 ? true : false}
                >
                    Lưu lại
                </Button>
            </Box>
        </Box>
    );
}

export default AddMemberToEvent;
