import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import moment from 'moment';

import adminTournamentAPI from 'src/api/adminTournamentAPI';

function TournamentFeeReport() {
    let { tournamentId, typeId } = useParams();
    const [pageSize, setPageSize] = useState(10);
    const [membershipReport, setMembershipReport] = useState([]);
    moment().locale('vi');
    const navigate = useNavigate();

    const getReportPayment = async (tournamentId, typeId) => {
        try {
            if (typeId == 1) {
                const response = await adminTournamentAPI.getAllTournamentOrganizingCommitteePaymentStatusReport(
                    tournamentId,
                );
                setMembershipReport(response.data);
                console.log('report 1', response.data);
            } else {
                const response = await adminTournamentAPI.getAllTournamentPlayerPaymentStatusReport(tournamentId);
                setMembershipReport(response.data);
                console.log('report 2', response.data);
            }
        } catch (error) {
            console.log('khong lay duoc roi dm');
        }
    };

    useEffect(() => {
        getReportPayment(tournamentId, typeId);
    }, [tournamentId, typeId]);

    const columns = [
        { field: 'date', type: 'date', headerName: 'Ngày chỉnh sửa', flex: 0.5 },
        { field: 'time', headerName: 'Thời gian chỉnh sửa', flex: 0.8 },
        { field: 'note', headerName: 'Nội dung chỉnh sửa', flex: 1.5 },
        //{ field: 'studentName', headerName: 'Tên người bị sửa', flex: 0.8 },

        {
            field: 'userStudentId',
            headerName: 'Mã sinh viên',
            width: 150,
            flex: 0.5,
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
        {
            field: 'updatedBy',
            headerName: 'Chỉnh sửa bởi',
            width: 150,
            flex: 0.5,
        },
        { field: 'fundBalance', headerName: 'Số dư', flex: 0.5 },
    ];
    const rowsUser = membershipReport.map((item, index) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = moment(new Date(item.createdOn)).format('DD-MM-yyyy');
        container['time'] = moment(new Date(item.createdOn)).format('HH:mm:ss');
        container['userName'] = item.userName;
        container['userStudentId'] = item.userStudentId;
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
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h3">Lịch sử đóng tiền giải đấu</Typography>
                    <Typography variant="h5">{typeId == 1 ? 'Ban tổ chức' : 'Người tham gia'}</Typography>
                </Box>
                {/* <Button variant="contained" color="success" size="small" onClick={() => navigate(-1)}>
                    Quay lại
                </Button> */}
            </Box>
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
                    // loading={!membershipReport.length}
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

export default TournamentFeeReport;
