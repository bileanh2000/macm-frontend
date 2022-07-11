import { Fragment, useState } from 'react';
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
} from 'recharts';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Box, Typography } from '@mui/material';
import semesterApi from 'src/api/semesterApi';
import { useEffect } from 'react';
import dashboardApi from 'src/api/dashboardApi';

function FeeReport() {
    const [feeReportList, setFeeReportList] = useState([]);
    const [semesterList, setSemesterList] = useState([]);
    const [semester, setSemester] = useState('Summer2022');
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
    const fetchFeeReport = async (semester) => {
        try {
            const response = await dashboardApi.getFeeReportBySemester(semester);
            console.log('Fee Report', response.data);

            setFeeReportList(response.data);
        } catch (error) {
            console.log('Failed when fetch fee Report', error);
        }
    };
    useEffect(() => {
        fetchFeeReport(semester);
        fetchSemester();
    }, [semester]);
    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" color="initial">
                    Thống kê tình trạng thu chi CLB
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
                <LineChart
                    width={500}
                    height={300}
                    data={feeReportList && feeReportList}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                        unit="  VND"
                        tick={{ fontSize: '12px' }}
                        tickCount={11}
                        domain={[0, (dataMax) => Math.ceil(Number(dataMax) / 10000) * 10000]}
                        tickFormatter={(tick) => `${Math.floor(tick).toLocaleString('pt-BR')}`}
                        tickMargin={5}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                        name="Thu"
                        type="monotone"
                        dataKey="totalIncome"
                        stroke="#8884d8"
                        unit="  VND"
                        tickFormatter={(tick) => `${Math.floor(tick).toLocaleString('pt-BR')}`}
                    />
                    <Line
                        name="Chi"
                        type="monotone"
                        dataKey="totalSpend"
                        stroke="#82ca9d"
                        unit="  VND"
                        tickFormatter={(tick) => `${Math.floor(tick).toLocaleString('pt-BR')}`}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Fragment>
    );
}

export default FeeReport;
