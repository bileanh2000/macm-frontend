import { Fragment, useState } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Box, Typography } from '@mui/material';
import semesterApi from 'src/api/semesterApi';
import { useEffect } from 'react';
import dashboardApi from 'src/api/dashboardApi';
// const data = [
//     { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
//     { name: 'Page b', uv: 500, pv: 100, amt: 6400 },
//     { name: 'Page c', uv: 100, pv: 2900, amt: 4400 },
// ];
const data = [
    {
        semester: 'Spring2022',
        numberJoin: 14,
        numberPassed: 14,
        numberNotPassed: 0,
        numberMale: 8,
        numberFemale: 6,
    },
    {
        semester: 'Summer2022',
        numberJoin: 20,
        numberPassed: 15,
        numberNotPassed: 5,
        numberMale: 14,
        numberFemale: 6,
    },
];

function AttendanceChart() {
    const [semesterList, setSemesterList] = useState([]);
    const [semester, setSemester] = useState('Summer2022');
    const [attendanceReportList, setAttendanceReportList] = useState([]);

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
    const fetchAttendanceReportBySemester = async (semester) => {
        try {
            const response = await dashboardApi.getAttendanceReportBySemester(semester);
            console.log('fetchAttendanceReportBySemester:', response.data);
            setAttendanceReportList(response.data);
        } catch (error) {
            console.log('failed when fetchAttendanceReportBySemester:', error);
        }
    };
    useEffect(() => {
        fetchSemester();
        fetchAttendanceReportBySemester(semester);
    }, [semester]);
    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" color="initial">
                    Thống kê số lượng thành viên tham gia từng buổi tập
                </Typography>
                <TextField
                    size="small"
                    variant="standard"
                    id="standard-select"
                    select
                    label="Chọn kỳ"
                    value={semester}
                    onChange={handleChange}
                >
                    {semesterList &&
                        semesterList.map((semester) => (
                            <MenuItem key={semester.id} value={semester.name}>
                                {semester.name}
                            </MenuItem>
                        ))}
                </TextField>
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
