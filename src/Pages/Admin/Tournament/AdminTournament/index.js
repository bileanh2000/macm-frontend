import { Box, Button, FormControl, Grid, MenuItem, Select, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import eventApi from 'src/api/eventApi';
import AdminList from './AdminList';
// import Header from './Header';
// import MemberList from './MemberList';

const _memberList = [
    {
        studentName: 'Duong Thanh Tung',
        studentId: 'HE123456',
        attendanceStatus: true,
        role: 'Thành viên ban văn hóa',
        paymentStatus: true,
    },
    {
        studentName: 'Pham Minh Duc',
        studentId: 'HE456789',
        attendanceStatus: true,
        role: 'Thành viên ban truyền thông',
        paymentStatus: true,
    },
    {
        studentName: 'Dam Van Toan',
        studentId: 'HE987654',
        attendanceStatus: true,
        role: 'Thành viên ban hậu cần',
        paymentStatus: true,
    },
];

function AdminTournament() {
    let { id } = useParams();
    const [type, setType] = useState(0);
    const [adminList, setAdminList] = useState([]);

    const handleChangeType = (event) => {
        setType(event.target.value);
    };

    const fetchUserInEvent = async (params, index) => {
        // try {
        //     const response = await eventApi.getAllMemberEvent(params, index);
        //     console.log(response);
        //     setUserList(response.data);
        // } catch (error) {
        //     console.log('Failed to fetch user list: ', error);
        // }
    };

    useEffect(() => {
        fetchUserInEvent(id, type);
    }, [id, type]);

    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    Danh sách thành viên tham gia
                </Typography>
                <Box>
                    <Button
                        variant="outlined"
                        component={Link}
                        to={`/admin/events/${id}/member/addtoadmin`}
                        sx={{ mr: 2 }}
                    >
                        Cập nhật thành viên ban tổ chức
                    </Button>
                </Box>
            </Box>
            <AdminList data={adminList} />
        </Fragment>
    );
}

export default AdminTournament;
