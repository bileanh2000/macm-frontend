import { MenuItem, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect } from 'react';
import { Fragment, useState } from 'react';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    AreaChart,
    ResponsiveContainer,
    Area,
    Legend,
} from 'recharts';
import dashboardApi from 'src/api/dashboardApi';
import semesterApi from 'src/api/semesterApi';

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

function MemberChart() {
    const [memberReport, setMemberReport] = useState([]);
    const [currentSemester, setCurrentSemester] = useState([]);
    const [semesterList, setSemesterList] = useState([]);
    const [semester, setSemester] = useState('Summer2022');

    const fetchMemberReport = (semester) => {
        try {
            const response = dashboardApi.getFeeReportBySemester(semester);
            setMemberReport(response.data);
        } catch (error) {}
    };

    const handleChange = (event) => {
        setSemester(event.target.value);
    };

    useEffect(() => {
        const fetchTop3Semester = async () => {
            try {
                const response = await semesterApi.getTop3Semester();
                console.log('fetchTop3Semester', response.data);
                setSemesterList(response.data);
            } catch (error) {
                console.log('failed when fetchTop3Semester', error);
            }
        };
        const fetchCurrentSemester = async () => {
            try {
                const response = await semesterApi.getCurrentSemester();
                console.log('fetchCurrentSemester', response.data);
                setSemester(response.data[0].name);
                setCurrentSemester(response.data[0].name);
            } catch (error) {
                console.log('failed when fetchTop3Semester', error);
            }
        };
        fetchTop3Semester();
        fetchCurrentSemester();
    }, []);

    useEffect(() => {
        fetchMemberReport(semester);
    }, [semester]);
    return (
        <Fragment>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="initial" sx={{ mb: 3.5 }}>
                    Thống kê số lượng CTV theo kỳ
                </Typography>
                <TextField
                    id="outlined-select-currency"
                    variant="standard"
                    size="small"
                    select
                    label="Chọn kỳ"
                    value={semester}
                    onChange={handleChange}
                >
                    {semesterList.map((i, index) => {
                        return (
                            <MenuItem key={index} value={i.name}>
                                {i.name}
                            </MenuItem>
                        );
                    })}
                </TextField>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    width={500}
                    height={300}
                    data={memberReport}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semester" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line name="Số CTV đăng ký" type="monotone" dataKey="numberJoin" stroke="#8884d8" />
                    <Line name="Số CTV thành thành viên" type="monotone" dataKey="numberPassed" stroke="#82ca9d" />
                    <Line name="Số CTV bị loại" type="monotone" dataKey="numberNotPassed" stroke="#ffc658" />
                </LineChart>
            </ResponsiveContainer>
        </Fragment>
    );
}

export default MemberChart;
