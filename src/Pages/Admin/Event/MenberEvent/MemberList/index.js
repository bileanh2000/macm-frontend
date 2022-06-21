import React, { useState } from 'react';
import { Box } from '@mui/system';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';

function MemberList({ data }) {
    const [pageSize, setPageSize] = useState(10);

    console.log(data);
    const columns = [
        //{ field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'studentName', headerName: 'Tên', flex: 0.8 },
        {
            field: 'studentId',
            headerName: 'Mã sinh viên',
            width: 150,
            flex: 0.6,
        },
        {
            field: 'attendanceStatus',
            headerName: 'Trạng thái',
            width: 150,
            flex: 0.6,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('status-rows', {
                    active: params.value === 'Đã đăng kí',
                    deactive: params.value === 'Đã hủy',
                });
            },
        },
        { field: 'role', headerName: 'Vai trò', width: 150, flex: 0.6 },
        {
            field: 'paymentStatus',
            headerName: 'Đóng tiền',
            flex: 0.5,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('status-rows', {
                    active: params.value === 'Đã đóng',
                    deactive: params.value === 'Chưa đóng',
                });
            },
        },
    ];

    const rowsUser = data.map((item, index) => {
        const container = {};
        container['id'] = index + 1;
        container['studentName'] = item.studentName;
        container['studentId'] = item.studentId;
        container['attendanceStatus'] = item.attendanceStatus ? 'Đã đăng kí' : 'Đã hủy';
        container['role'] = item.role;
        container['paymentStatus'] = item.paymentStatus ? 'Đã đóng' : 'Chưa đóng';
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
                loading={!data.length}
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
    );
}

export default MemberList;
