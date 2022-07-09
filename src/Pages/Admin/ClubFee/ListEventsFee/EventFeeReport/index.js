import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import moment from 'moment';

import adminClubFeeAPI from 'src/api/adminClubFeeAPI';
import eventApi from 'src/api/eventApi';

function EventFeeReport() {
    moment().locale('vi');
    const location = useLocation();
    const { eventId } = useParams();
    const [event, setEvent] = useState();
    const [pageSize, setPageSize] = useState(10);
    const [userPaymentReport, setUserPaymentReport] = useState([]);

    console.log(eventId);

    const getReportEvent = async () => {
        try {
            const response = await adminClubFeeAPI.getReportEvent(eventId);
            setUserPaymentReport(response.data);
            console.log(response.data);
        } catch (error) {
            console.log('Không thể lấy dữ liệu');
        }
    };

    const getEventById = async (eventId) => {
        try {
            const response = await eventApi.getAll();
            let selectedEvent = response.data.filter((item) => item.id === parseInt(eventId, 10));
            setEvent(selectedEvent[0]);
            // selectedEvent.status === 'Đã kết thúc' ? setView(false) : setView(true);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };

    useEffect(() => {
        getReportEvent();
        getEventById(eventId);
    }, []);

    const columns = [
        { field: 'date', type: 'date', headerName: 'Ngày chỉnh sửa', flex: 0.5 },
        { field: 'time', headerName: 'Thời gian chỉnh sửa', flex: 0.5 },
        { field: 'note', headerName: 'Nội dung chỉnh sửa', flex: 1 },
        { field: 'studentName', headerName: 'Tên', flex: 0.8 },
        {
            field: 'studentId',
            headerName: 'Mã sinh viên',
            width: 150,
            flex: 0.6,
        },
        {
            field: 'updatedBy',
            headerName: 'Chỉnh sửa bởi',
            width: 150,
            flex: 0.6,
        },
    ];

    const rowsUser = userPaymentReport.map((item, index) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = moment(new Date(item.createdOn)).format('DD-MM-yyyy');
        container['time'] = moment(new Date(item.createdOn)).format('HH:mm:ss');
        container['studentName'] = item.userName;
        container['studentId'] = item.userStudentId;
        let paymentStatus;
        if (item.amountPerRegisterActual == 0) {
            paymentStatus =
                item.paymentValue == 0 ? 'Thay đổi trạng thái thành chưa đóng' : 'Thay đổi trạng thái thành đã đóng';
        } else {
            if (item.paymentValue == 0) {
                paymentStatus = 'Thay đổi trạng thái thành chưa đóng';
            } else if (
                item.paymentValue == item.amountPerRegisterEstimate &&
                item.paymentValue < item.amountPerRegisterActual
            ) {
                paymentStatus = 'Thay đổi trạng thái thành chưa đóng đủ';
            } else if (item.paymentValue == item.amountPerRegisterActual) {
                paymentStatus = 'Thay đổi trạng thái thành đã đóng';
            }
        }
        container['note'] = paymentStatus;
        container['fundChange'] = item.fundChange;
        container['updatedBy'] = item.createdBy;
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
        <div>
            {event && (
                <Box>
                    <Typography variant="h3">Lịch sử thay đổi sự kiện</Typography>
                    <Typography variant="h5">{event.name}</Typography>
                </Box>
            )}
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
                    },
                    '& .status-rows.deactive': {
                        backgroundColor: '#ff3838',
                        color: '#fff',
                        fontWeight: '600',
                    },
                }}
            >
                <DataGrid
                    //loading={!userPaymentReport.length}
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
        </div>
    );
}

export default EventFeeReport;
