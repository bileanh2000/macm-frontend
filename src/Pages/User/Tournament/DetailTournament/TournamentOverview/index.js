import React, { Fragment, useEffect, useState } from 'react';
import {
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import userTournamentAPI from 'src/api/userTournamentAPI';

function TournamentOverview({ tournament, value, index, schedule, onChangeTab }) {
    let { tournamentId } = useParams();
    const [isRender, setIsRender] = useState(true);
    const [roleInTournament, setRoleInTournament] = useState([]);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        // [`&.${tableCellClasses.head}`]: {
        //     backgroundColor: theme.palette.common.black,
        //     color: theme.palette.common.white,
        // },
        // [`&.${tableCellClasses.body}`]: {
        //     fontSize: 14,
        // },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
        '&:hover': {
            backgroundColor: '#57a6f4 !important',
            cursor: 'pointer',
        },
    }));

    useEffect(() => {
        const getRoleInTournament = async () => {
            try {
                const response = await userTournamentAPI.getAllOrginizingCommitteeRole(tournamentId);
                console.log('role', response);
                setRoleInTournament(response.data);
                setIsRender(false);
            } catch (error) {
                console.log('Khong the lay duoc role', error);
            }
        };
        isRender && getRoleInTournament();
    }, [tournamentId, roleInTournament, isRender]);

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {tournament && (
                <Fragment>
                    <Grid container columns={12} sx={{ width: '100% ', m: 0 }} spacing={2}>
                        <Grid item xs={12}>
                            {/* <Typography variant="body1" sx={{ p: 2, m: 1 }}>
                                <strong>Nội dung: </strong>
                                {tournament.description}
                            </Typography>
                            <Typography variant="body1" sx={{ p: 2, m: 1 }}>
                                <strong>Hạng mục thi đấu:</strong>
                            </Typography> */}
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nội dung</TableCell>
                                            <TableCell>Vai trò</TableCell>
                                            <TableCell align="left">Chi phí</TableCell>
                                            <TableCell align="left">Thời gian</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                verticalAlign: 'baseline',
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Typography variant="body1" sx={{}}>
                                                    {tournament.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <ul>
                                                    {roleInTournament.map((role) => {
                                                        return (
                                                            <li key={role.id}>
                                                                <strong>{role.name}</strong>:{' '}
                                                                {role.maxQuantity - role.availableQuantity}/
                                                                {role.maxQuantity} người
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </TableCell>
                                            <TableCell align="left">
                                                <ul>
                                                    <li>
                                                        {!tournament.totalAmountActual ? (
                                                            <>
                                                                <strong>Tổng số tiền dự kiến: </strong>
                                                                {tournament.totalAmountEstimate.toLocaleString()} VND
                                                            </>
                                                        ) : (
                                                            <>
                                                                <strong>Tổng số tiền thực tế: </strong>
                                                                {tournament.totalAmount.toLocaleString()} VND
                                                            </>
                                                        )}
                                                    </li>
                                                    <li>
                                                        <strong>Số tiền tài trợ từ CLB: </strong>
                                                        {tournament.totalAmountFromClubActual > 0
                                                            ? tournament.totalAmountFromClubActual.toLocaleString()
                                                            : tournament.totalAmountFromClubEstimate.toLocaleString()}{' '}
                                                        VND
                                                    </li>
                                                    <li>
                                                        <>
                                                            <strong>
                                                                Dự kiến số tiền mỗi vận động viên cần phải đóng:{' '}
                                                            </strong>
                                                            {tournament.feePlayerPay.toLocaleString()} VND
                                                        </>
                                                        <br />
                                                        <>
                                                            <strong>
                                                                Số tiền mỗi người ban tổ chức cần phải đóng:{' '}
                                                            </strong>
                                                            {tournament.feeOrganizingCommiteePay.toLocaleString()} VND
                                                        </>
                                                    </li>
                                                </ul>
                                            </TableCell>
                                            <TableCell align="left">
                                                <ul>
                                                    <li>
                                                        <strong>Thời gian bắt đầu: </strong>
                                                        <br />
                                                        {schedule[0].startTime.slice(0, 5)} -{' '}
                                                        {moment(schedule[0].date).format('DD/MM/yyyy')}
                                                    </li>
                                                    <li>
                                                        <strong>Thời gian kết thúc: </strong>
                                                        <br />
                                                        {schedule[schedule.length - 1].finishTime.slice(0, 5)} -{' '}
                                                        {moment(schedule[schedule.length - 1].date).format(
                                                            'DD/MM/yyyy',
                                                        )}
                                                    </li>
                                                    <li>
                                                        <strong>Deadline đăng ký tham gia: </strong>
                                                        <br />
                                                        {moment(tournament.registrationPlayerDeadline).format(
                                                            'HH:mm - DD/MM/yyyy',
                                                        )}
                                                    </li>
                                                    {tournament.registrationOrganizingCommitteeDeadline ===
                                                    null ? null : (
                                                        <li>
                                                            <strong>Deadline đăng ký BTC: </strong>
                                                            <br />
                                                            {moment(
                                                                tournament.registrationOrganizingCommitteeDeadline,
                                                            ).format('HH:mm - DD/MM/yyyy')}
                                                        </li>
                                                    )}
                                                </ul>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid container columns={12} sx={{ width: '100% ', mb: 2, ml: 0, p: 2 }} spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Paper elevation={3}>
                                    {tournament.competitiveTypes.length > 0 && (
                                        <TableContainer sx={{ maxHeight: 440 }}>
                                            <Typography variant="body1">
                                                <strong>Thi đấu đối kháng: </strong>
                                            </Typography>
                                            <Table stickyHeader aria-label="sticky table">
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell align="center">Giới tính</StyledTableCell>
                                                        <StyledTableCell align="center">Hạng cân</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {tournament.competitiveTypes.map((data) => (
                                                        <StyledTableRow
                                                            key={data.id}
                                                            onClick={(e) => {
                                                                onChangeTab && onChangeTab(4, 0, data.id);
                                                            }}
                                                        >
                                                            <StyledTableCell align="center">
                                                                {data.gender ? 'Nam' : 'Nữ'}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                {data.weightMin} - {data.weightMax} Kg
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Paper elevation={3}>
                                    {tournament.exhibitionTypes.length > 0 && (
                                        <TableContainer sx={{ maxHeight: 440 }}>
                                            <Typography variant="body1">
                                                <strong>Thi đấu biểu diễn: </strong>
                                            </Typography>
                                            <Table aria-label="sticky table">
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell align="center">
                                                            Nội dung thi đấu
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">Số lượng nữ</StyledTableCell>
                                                        <StyledTableCell align="center">Số lượng nam</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {tournament.exhibitionTypes.map((data) => (
                                                        <StyledTableRow
                                                            key={data.id}
                                                            onClick={(e) => {
                                                                onChangeTab && onChangeTab(4, 1, data.id);
                                                            }}
                                                        >
                                                            <StyledTableCell align="center">
                                                                {data.name}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                {data.numberFemale}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                {data.numberMale}
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Fragment>
            )}
        </div>
    );
}
export default TournamentOverview;
