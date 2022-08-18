import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Divider,
    IconButton,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import moment from 'moment';
import { Link, Navigate } from 'react-router-dom';

import semesterApi from 'src/api/semesterApi';
import adminAttendanceAPI from 'src/api/adminAttendanceAPI';
import { BorderColorOutlined, VisibilityOutlined } from '@mui/icons-material';
import { IfAnyGranted } from 'react-authorization';

function EditAttendance() {
    const [semester, setSemester] = useState('Summer2022');
    const [type, setType] = useState(0);
    const [semesterList, setSemesterList] = useState([]);
    const [listDate, setListDate] = useState([]);

    const handleChange = (event) => {
        setSemester(event.target.value);
        type == 0 ? listTrainingSchedule(event.target.value) : listEventSchedule(event.target.value);
    };

    const handleChangeType = (event) => {
        setType(event.target.value);
        event.target.value == 0 ? listTrainingSchedule(semester) : listEventSchedule(semester);
    };

    const listTrainingSchedule = async (semester) => {
        try {
            const response = await adminAttendanceAPI.getListOldTrainingScheduleToTakeAttendanceBySemester(semester);
            console.log('list training schedule', response.data);
            setListDate(response.data);
        } catch (error) {
            console.warn('Failed to get list training schedule', error);
        }
    };

    const listEventSchedule = async (semester) => {
        try {
            const response = await adminAttendanceAPI.getListOldEventToTakeAttendanceBySemester(semester);
            console.log('list event', response.data);
            setListDate(response.data);
        } catch (error) {
            console.warn('Failed to get list training schedule', error);
        }
    };

    const fetchSemester = async () => {
        try {
            const response = await semesterApi.getTop3Semester();
            console.log('Thanh cong roi, semester: ', response);
            setSemesterList(response.data);
        } catch (error) {
            console.log('That bai roi huhu, semester: ', error);
        }
    };

    useEffect(() => {
        fetchSemester();
        listTrainingSchedule(semester);
    }, []);

    return (
        <IfAnyGranted
            expected={['ROLE_ViceHeadClub', 'ROLE_HeadClub', 'ROLE_HeadTechnique', 'ROLE_ViceHeadTechnique']}
            actual={JSON.parse(localStorage.getItem('currentUser')).role.name}
            unauthorized={<Navigate to="/forbidden" />}
        >
            <Box sx={{ m: 1, p: 1 }}>
                <Container maxWidth="xl">
                    <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                        {/* Trạng thái điểm danh ngày: {moment(new Date(_nowDate)).format('DD/MM/yyyy')} */}
                        {type == 0 ? 'Danh sách lịch tập' : 'Danh sách lịch sự kiện'}
                    </Typography>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 2 }}>
                        <TextField
                            id="outlined-select-currency"
                            select
                            size="small"
                            label="Chọn kỳ"
                            value={semester}
                            onChange={handleChange}
                        >
                            {semesterList.map((option) => (
                                <MenuItem key={option.id} value={option.name}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            size="small"
                            id="demo-simple-select"
                            value={type}
                            select
                            label="Chọn lịch"
                            onChange={handleChangeType}
                            variant="outlined"
                        >
                            <MenuItem value={0}>Tập luyện</MenuItem>
                            <MenuItem value={1}>Sự kiện</MenuItem>
                        </TextField>
                    </Box>
                    <TableContainer component={Paper} sx={{ mt: 1 }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Hoạt động</TableCell>
                                    <TableCell>Ngày</TableCell>
                                    <TableCell>Giờ</TableCell>
                                    <TableCell>Có mặt</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listDate.map((row, index) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>{type == 0 ? 'Lịch tập' : row.name}</TableCell>
                                        <TableCell>
                                            {type == 0
                                                ? moment(row.date).format('dddd')
                                                : moment(row.date).format('dddd')}
                                            <br />

                                            {type == 0
                                                ? moment(row.startDate).format('DD/MM/YYYY')
                                                : moment(row.startDate).format('DD/MM/YYYY')}
                                            <br />
                                        </TableCell>
                                        <TableCell>
                                            {row.startTime} - {type == 0 ? row.finishTime : row.endTime}
                                        </TableCell>
                                        <TableCell>
                                            {row.totalAttend}/{type == 0 ? row.totalSize : row.totalJoin}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Xem trạng thái điểm danh">
                                                <IconButton
                                                    LinkComponent={Link}
                                                    to={`../admin/attendance`}
                                                    state={{
                                                        id: row.id,
                                                        date:
                                                            type == 0
                                                                ? moment(row.date).format('DD/MM/YYYY')
                                                                : moment(row.startDate).format('DD/MM/YYYY'),
                                                        type: type,
                                                    }}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <VisibilityOutlined />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Chỉnh sửa trạng thái điểm danh">
                                                <IconButton
                                                    LinkComponent={Link}
                                                    to="../admin/attendance/take"
                                                    state={{
                                                        id: row.id,
                                                        date:
                                                            type == 0
                                                                ? moment(row.date).format('DD/MM/YYYY')
                                                                : moment(row.startDate).format('DD/MM/YYYY'),
                                                        type: type,
                                                    }}
                                                >
                                                    <BorderColorOutlined />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>
        </IfAnyGranted>
    );
}

export default EditAttendance;
