import { Typography } from '@mui/material';
import { Fragment } from 'react';
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
const CustomTooltip = () => <div>hahaha</div>;
function MemberChart() {
    return (
        <Fragment>
            <Typography variant="h6" color="initial">
                Thống kê số lượng CTV theo kỳ
            </Typography>
            {/* <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    width={500}
                    height={400}
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semester" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="numberJoin" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="numberPassed" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="numberNotPassed" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    <Legend />
                </AreaChart>
            </ResponsiveContainer> */}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    width={500}
                    height={300}
                    data={data}
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
