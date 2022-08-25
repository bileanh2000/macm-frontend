import { Fragment, useState } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Box, Typography } from '@mui/material';
import semesterApi from 'src/api/semesterApi';
import { useEffect } from 'react';
import dashboardApi from 'src/api/dashboardApi';
import eventApi from 'src/api/eventApi';

function AttendanceChart() {
    const [semesterList, setSemesterList] = useState([]);
    const [semester, setSemester] = useState('Summer2022');
    const [attendanceReportList, setAttendanceReportList] = useState([]);
    const [monthInSemester, setMonthInSemester] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);

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
    const fetchAttendanceReportBySemester = async (semester, month) => {
        try {
            const response = await dashboardApi.getAttendanceReportBySemester(semester, month);
            console.log('fetchAttendanceReportBySemester:', response.data);
            setAttendanceReportList(response.data);
        } catch (error) {
            console.log('failed when fetchAttendanceReportBySemester:', error);
        }
    };

    const fetchMonthInSemester = async (semester) => {
        try {
            const response = await eventApi.getMonthsBySemester(semester);
            setMonthInSemester(response.data);
            console.log('monthsInSemester', response.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchSemester();
        fetchAttendanceReportBySemester(semester, month);
        fetchMonthInSemester(semester);
    }, [semester, month]);
    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" color="initial">
                    Thống kê số lượng thành viên tham gia từng buổi tập
                </Typography>
                <Box>
                    <TextField
                        size="small"
                        variant="standard"
                        id="standard-select"
                        select
                        label="Chọn kỳ"
                        value={semester}
                        onChange={handleChange}
                        sx={{ mr: 2 }}
                    >
                        {semesterList &&
                            semesterList.map((semester) => (
                                <MenuItem key={semester.id} value={semester.name}>
                                    {semester.name}
                                </MenuItem>
                            ))}
                    </TextField>
                    <TextField
                        size="small"
                        variant="standard"
                        id="standard-select"
                        select
                        label="Chọn tháng"
                        value={month}
                        onChange={(e) => {
                            setMonth(e.target.value);
                        }}
                    >
                        {monthInSemester.map((month) => (
                            <MenuItem key={month} value={month}>
                                Tháng {month}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    width={500}
                    height={300}
                    data={attendanceReportList && attendanceReportList}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    ff569b
                    <Legend />
                    <Bar name="Có mặt" dataKey="totalAttendInTrainingSession" stackId="a" fill="#8884d8" />
                    <Bar name="Vắng mặt" dataKey="totalAbsentInTrainingSession" stackId="a" fill="#ff569b" />
                </BarChart>
            </ResponsiveContainer>
        </Fragment>
    );
}

export default AttendanceChart;
