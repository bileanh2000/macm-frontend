import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

import adminClubFeeAPI from 'src/api/adminClubFeeAPI';

function EventFeeReport() {
    moment().locale('vi');
    const location = useLocation();
    const event = location.state?.event;
    const [pageSize, setPageSize] = useState(10);
    const [userPaymentReport, setUserPaymentReport] = useState([]);

    console.log(event);

    const getReportEvent = async () => {
        try {
            if (event) {
                const response = await adminClubFeeAPI.getReportEvent(event.id);
                setUserPaymentReport(response.data);
                console.log(response.data);
            }
        } catch (error) {
            console.log('Không thể lấy dữ liệu');
        }
    };

    useEffect(() => {
        getReportEvent();
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
        container['note'] =
            item.fundChange == true ? 'Thay đổi trạng thái thành đã đóng' : 'Thay đổi trạng thái thành chưa đóng';
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
                    loading={!userPaymentReport.length}
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
