import React, { useState } from 'react';
import { Typography } from '@mui/material';
import clsx from 'clsx';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import { renderSelectEditCell } from './RenderSelectEditCell';

const _memberList = [
    {
        studentName: 'Duong Thanh Tung',
        studentId: 'HE123456',
        attendanceStatus: true,
        role: { roleId: 2, roleName: 'Thành viên ban văn hóa' },
        paymentStatus: true,
    },
    {
        studentName: 'Pham Minh Duc',
        studentId: 'HE456789',
        attendanceStatus: true,
        role: { roleId: 1, roleName: 'Thành viên ban truyền thông' },
        paymentStatus: true,
    },
    {
        studentName: 'Dam Van Toan',
        studentId: 'HE987654',
        attendanceStatus: true,
        role: { roleId: 3, roleName: 'Thành viên ban hậu cần' },
        paymentStatus: true,
    },
];

function AddMemberToAdminEvent() {
    const [pageSize, setPageSize] = useState(10);
    const [editRowsModel, setEditRowsModel] = React.useState({});

    const handleEditRowModelChange = React.useCallback((params) => {
        setEditRowsModel(params.model);
        console.log(params.model);
    }, []);

    const handleBlur = React.useCallback((params, event) => {
        event.stopPropagation();
    }, []);

    const columns = [
        { field: 'studentName', headerName: 'Tên', flex: 0.8 },
        {
            field: 'studentId',
            headerName: 'Mã sinh viên',
            width: 150,
            flex: 0.6,
        },
        // {
        //     field: 'attendanceStatus',
        //     headerName: 'Trạng thái',
        //     width: 150,
        //     flex: 0.6,
        //     cellClassName: (params) => {
        //         if (params.value == null) {
        //             return '';
        //         }

        //         return clsx('status-rows', {
        //             active: params.value === 'Đã đăng kí',
        //             deactive: params.value === 'Đã hủy',
        //         });
        //     },
        // },
        {
            field: 'roleName',
            headerName: 'Vai trò',
            width: 150,
            flex: 0.6,
        },
        {
            field: 'roleId',
            headerName: '',
            width: 150,
            flex: 0.6,
            editable: true,
            renderEditCell: renderSelectEditCell,
        },
        // {
        //     field: 'paymentStatus',
        //     headerName: 'Đóng tiền',
        //     flex: 0.5,
        //     cellClassName: (params) => {
        //         if (params.value == null) {
        //             return '';
        //         }

        //         return clsx('status-rows', {
        //             active: params.value === 'Đã đóng',
        //             deactive: params.value === 'Chưa đóng',
        //         });
        //     },
        // },
    ];

    const rowsUser = _memberList.map((item, index) => {
        const container = {};
        container['id'] = index + 1;
        container['studentName'] = item.studentName;
        container['studentId'] = item.studentId;
        container['attendanceStatus'] = item.attendanceStatus ? 'Đã đăng kí' : 'Đã hủy';
        container['roleId'] = item.role.roleId;
        container['roleName'] = item.role.roleName;
        container['paymentStatus'] = item.paymentStatus ? 'Đã đóng' : 'Chưa đóng';
        return container;
    });

    const CustomToolbar = () => {
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
    };

    return (
        <div>
            <Typography variant="h3">Cập nhật thành viên vào ban tổ chức</Typography>
            <Box
                sx={{
                    height: '70vh',
                    width: '100%',
                }}
            >
                <DataGrid
                    loading={!_memberList.length}
                    disableSelectionOnClick={true}
                    rows={rowsUser}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 20, 30]}
                    //editRowsModel={editRowsModel}
                    onEditRowModelChange={handleEditRowModelChange}
                    onCellBlur={handleBlur}
                    components={{
                        Toolbar: CustomToolbar,
                    }}
                />
            </Box>
        </div>
    );
}

export default AddMemberToAdminEvent;
