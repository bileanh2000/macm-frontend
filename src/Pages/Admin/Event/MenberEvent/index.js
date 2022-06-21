import { Button, FormControl, Grid, MenuItem, Select, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
    const [type, setType] = useState('All');

    const handleChangeType = (event) => {
        setType(event.target.value);
    };

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="h4">Danh sách thành viên tham gia</Typography>
                    <FormControl size="medium">
                        <Typography variant="caption">Vai Trò</Typography>
                        <Select id="demo-simple-select" value={type} displayEmpty onChange={handleChangeType}>
                            <MenuItem value="All">
                                <em>Tất cả</em>
                            </MenuItem>
                            <MenuItem value={'Admin'}>Thành viên ban tổ chức</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item container xs={6}>
                    <Link to="./membercancel" style={{ color: 'blue' }}>
                        Danh sách thành viên hủy đăng ký tham gia sự kiện
                    </Link>
                    <Grid item xs={8}>
                        <Button variant="contained">
                            <Link to="./addtoadmin">Cập nhật thành viên vào ban tổ chức</Link>
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained">
                            <Link to="./addtoadmin">Điểm danh</Link>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <MemberList data={_memberList} />
        </div>
    );
}

export default MenberEvent;
