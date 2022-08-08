import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import { Divider, Typography } from '@mui/material';
import moment from 'moment';

import adminClubFeeAPI from 'src/api/adminClubFeeAPI';

function ReportMembership() {
    const [pageSize, setPageSize] = useState(10);
    const [membershipReport, setMembershipReport] = useState([]);
    const location = useLocation();
    const semester = location.state?.semester;
    moment().locale('vi');

    const getReportMembership = async () => {
        try {
            const response = await adminClubFeeAPI.getReportMembership(semester.id);
            setMembershipReport(response.data);
            console.log(response.data);
        } catch (error) {
            console.log('khong lay duoc roi dm');
        }
    };

    useEffect(() => {
        getReportMembership();
    }, []);

    const columns = [
        { field: 'date', type: 'date', headerName: 'Ngày chỉnh sửa', flex: 0.5 },
        { field: 'time', headerName: 'Thời gian chỉnh sửa', flex: 0.3 },
        { field: 'note', headerName: 'Nội dung chỉnh sửa', flex: 1.5 },
        //{ field: 'studentName', headerName: 'Tên người bị sửa', flex: 0.8 },
        {
            field: 'updatedBy',
            headerName: 'Chỉnh sửa bởi',
            width: 150,
            flex: 0.3,
        },
        {
            field: 'studentId',
            headerName: 'Mã sinh viên',
            width: 150,
            flex: 0.3,
        },
        {
            field: 'fundChange',
            headerName: 'Số tiền',
            flex: 0.5,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }
                return clsx('status-rows', {
                    active: params.row.paymentStatus === true,
                    deactive: params.row.paymentStatus === false,
                });
            },
        },
        { field: 'fundBalance', headerName: 'Số dư', flex: 0.5 },
    ];
    const rowsUser = membershipReport.map((item, index) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = moment(new Date(item.createdOn)).format('DD-MM-yyyy');
        container['time'] = moment(new Date(item.createdOn)).format('HH:mm:ss');
        container['studentName'] = item.userName;
        container['studentId'] = item.userStudentId;
        container['paymentStatus'] = item.paymentStatus;
        container['note'] =
            item.paymentStatus == true
                ? `Cập nhật thành viên "${item.userName}" đã đóng tiền `
                : `Cập nhật thành viên "${item.userName}" chưa đóng tiền`;
        container['fundChange'] =
            item.fundChange > 0
                ? '+' + item.fundChange.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                : item.fundChange.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        container['fundBalance'] = item.fundBalance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
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
        <Box sx={{ m: 1, p: 1 }}>
            {semester && (
                <Box>
                    <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500 }}>
                        Lịch sử thay đổi chi phí câu lạc bộ
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6">Học kì: {semester.name}</Typography>
                </Box>
            )}
            <Box
                sx={{
                    height: '70vh',
                    '& .status-rows.active .MuiDataGrid-cellContent': {
                        backgroundColor: '#56f000',
                        color: '#fff',
                        fontWeight: '600',
                        textAlign: 'center',
                        padding: 1,
                        borderRadius: 5,
                    },
                    '& .status-rows.deactive .MuiDataGrid-cellContent': {
                        backgroundColor: '#ff3838',
                        color: '#fff',
                        fontWeight: '600',
                        textAlign: 'center',
                        padding: 1,
                        borderRadius: 5,
                    },
                }}
            >
                <DataGrid
                    loading={!membershipReport.length}
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
        </Box>
    );
}

export default ReportMembership;
