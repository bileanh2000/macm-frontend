import { Box, Button, FormControl, Grid, MenuItem, Select, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import eventApi from 'src/api/eventApi';
import Header from './Header';
import MemberList from './MemberList';

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

function MenberEvent() {
    let { id } = useParams();
    const [type, setType] = useState(0);
    const [userList, setUserList] = useState([]);

    const handleChangeType = (event) => {
        setType(event.target.value);
    };

    const fetchUserInEvent = async (params, index) => {
        try {
            const response = await eventApi.getAllMemberEvent(params, index);
            console.log(response);
            setUserList(response.data);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
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
                        // sx={{ mr: 2 }}
                    >
                        Cập nhật thành viên ban tổ chức
                    </Button>
                    <Button variant="contained">
                        <Link to="./addtoadmin">Điểm danh</Link>
                        Điểm danh
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                <FormControl size="small">
                    <Typography variant="caption">Vai Trò</Typography>
                    <Select id="demo-simple-select" value={type} displayEmpty onChange={handleChangeType}>
                        <MenuItem value={0}>
                            <em>Tất cả</em>
                        </MenuItem>
                        <MenuItem value={1}>Thành viên tham gia</MenuItem>
                        <MenuItem value={2}>Thành viên ban tổ chức</MenuItem>
                    </Select>
                </FormControl>
                <Link to={`../admin/events/${id}/membercancel`}>Danh sách thành viên hủy đăng ký tham gia sự kiện</Link>
                {/* <Typography variant="body1" component={}>Danh sách thành viên hủy đăng ký tham gia sự kiện</Typography> */}
            </Box>

            <MemberList data={userList} />
        </Fragment>
    );
}

export default MenberEvent;
