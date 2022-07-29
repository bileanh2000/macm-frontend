import { Container, Grid, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import semesterApi from 'src/api/semesterApi';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import userApi from 'src/api/userApi';
import classNames from 'classnames/bind';
import styles from '../Schedule/Schedule.module.scss';
import { Box } from '@mui/system';
import moment from 'moment';

const cx = classNames.bind(styles);
function AttendanceReport() {
    const [semesterList, setSemesterList] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [totalActivity, setTotalActivity] = useState(0);
    const [totalAbsent, setTotalAbsent] = useState(0);
    const [semester, setSemester] = useState('Summer2022');

    const studentId = JSON.parse(localStorage.getItem('currentUser')).studentId;
    const studentName = JSON.parse(localStorage.getItem('currentUser')).name;

    const handleChange = (event) => {
        setSemester(event.target.value);
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
    const fetchAttendanceList = async (studentId, semester) => {
        try {
            const response = await userApi.getAllAttendanceStatusBySemester(studentId, semester);
            console.log('Thanh cong roi, fetchAttendanceList: ', response);
            setAttendanceList(response.data);
            setTotalAbsent(response.data.filter((i) => i.status === 0).length);
            setTotalActivity(response.data.length);
        } catch (error) {
            console.log('That bai roi huhu, fetchAttendanceList: ', error);
        }
    };

    useEffect(() => {
        fetchSemester();
        fetchAttendanceList(studentId, semester);
    }, [semester]);
    return (
        <>
            <Container maxWidth="md">
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: '500', mb: 2 }}>
                        Báo cáo tình trạng điểm danh tập luyện của "{studentId} - {studentName}"
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <TextField
                            id="outlined-select-currency"
                            select
                            size="small"
                            label="Chọn kỳ"
                            value={semester}
                            onChange={handleChange}
                            sx={{ mr: 2 }}
                        >
                            {semesterList.map((option) => (
                                <MenuItem key={option.id} value={option.name}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Typography variant="button">
                            Vắng mặt: {(totalAbsent / totalActivity) * 100}% trên tổng số ({totalAbsent}/{totalActivity}
                            )
                        </Typography>
                    </Box>

                    <TableContainer component={Paper} sx={{ mt: 1 }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Hoạt động</TableCell>
                                    <TableCell>Ngày</TableCell>
                                    <TableCell>Giờ</TableCell>
                                    <TableCell>Trạng thái điểm danh</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attendanceList.map((row, index) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>{row.title}</TableCell>
                                        <TableCell>
                                            {moment(row.date).format('dddd')}
                                            <br />
                                            {moment(row.date).format('DD/MM/YYYY')}
                                        </TableCell>
                                        <TableCell>
                                            {row.startTime} - {row.finishTime}
                                        </TableCell>
                                        <TableCell>
                                            {row.status === 0 ? (
                                                <div className={cx('absent')}>Vắng mặt</div>
                                            ) : row.status === 1 ? (
                                                <div className={cx('attend')}>Có mặt</div>
                                            ) : (
                                                <div className={cx('not-yet')}>Not yet</div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>
        </>
    );
}

export default AttendanceReport;
