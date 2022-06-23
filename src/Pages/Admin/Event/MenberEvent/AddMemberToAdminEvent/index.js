import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import clsx from 'clsx';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import { renderSelectEditCell } from './RenderSelectEditCell';
import { useForm } from 'react-hook-form';

const _memberList = [
    {
        id: 10,
        studentName: 'Duong Thanh Tung',
        studentId: 'HE123456',
        attendanceStatus: true,
        role: { roleId: 2, roleName: 'Thành viên ban văn hóa' },
        paymentStatus: true,
    },
    {
        id: 20,
        studentName: 'Pham Minh Duc',
        studentId: 'HE456789',
        attendanceStatus: true,
        role: { roleId: 1, roleName: 'Thành viên ban truyền thông' },
        paymentStatus: true,
    },
    {
        id: 30,
        studentName: 'Dam Van Toan',
        studentId: 'HE987654',
        attendanceStatus: true,
        role: { roleId: 3, roleName: 'Thành viên ban hậu cần' },
        paymentStatus: true,
    },
];

const roles = [
    {
        roleId: 1,
        roleName: 'Thành viên ban truyền thông',
    },
    { roleId: 2, roleName: 'Thành viên ban văn hóa' },
    { roleId: 3, roleName: 'Thành viên ban hậu cần' },
];

function AddMemberToAdminEvent() {
    const [pageSize, setPageSize] = useState(10);

    const columns = [
        { field: 'studentName', headerName: 'Tên', flex: 0.8 },
        {
            field: 'studentId',
            headerName: 'Mã sinh viên',
            width: 150,
            flex: 0.6,
        },
        {
            field: 'role',
            headerName: 'Vai trò',
            width: 150,
            flex: 0.6,
            editable: true,
            type: 'singleSelect',
            // valueOptions: roles.map((role) => role.roleName),
            valueOptions: [
                { label: 'Thành viên ban truyền thông', value: 'Thành viên ban truyền thông' },
                { label: 'Thành viên ban văn hóa', value: 'Thành viên ban văn hóa' },
                { label: 'Thành viên ban hậu cần', value: 'Thành viên ban hậu cần' },
            ],
        },
    ];

    const rowsUser = _memberList.map((item, index) => {
        const container = {};
        container['id'] = item.id;
        container['studentName'] = item.studentName;
        container['studentId'] = item.studentId;
        container['attendanceStatus'] = item.attendanceStatus ? 'Đã đăng kí' : 'Đã hủy';
        container['role'] = item.role.roleName;
        container['paymentStatus'] = item.paymentStatus ? 'Đã đóng' : 'Chưa đóng';
        return container;
    });

    const { handleSubmit } = useForm({});

    const handleRowEditCommit = React.useCallback((params) => {
        const id = params.id;
        const key = params.field;
        const value = params.value;
        console.log(id, key, value, params);
        const newRole = roles.find((role) => role.roleName == value);
        console.log(newRole);
        console.log(_memberList);
        const newMemberList = _memberList.map((member) => (member.id === id ? { ...member, role: newRole } : member));
        console.log(newMemberList);
    }, []);

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
                    components={{
                        Toolbar: CustomToolbar,
                    }}
                    onCellEditCommit={handleRowEditCommit}
                />
            </Box>
        </div>
    );
}

export default AddMemberToAdminEvent;
