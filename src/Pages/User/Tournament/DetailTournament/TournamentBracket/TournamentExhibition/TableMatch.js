import React from 'react';
import {
    Chip,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import { KeyboardArrowDown, KeyboardArrowUp, SportsScore } from '@mui/icons-material';

function TableMatch(params) {
    console.log(params);

    function Row(props) {
        const { row, status, index } = props;
        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? (
                                <Tooltip title="Đóng" arrow>
                                    <KeyboardArrowUp />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Thành viên trong đội" arrow>
                                    <KeyboardArrowDown />
                                </Tooltip>
                            )}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {index + 1}
                    </TableCell>
                    <TableCell align="left">{row.teamName}</TableCell>
                    <TableCell align="left">
                        {row.time == null ? 'Chưa có thời gian thi đấu' : moment(row.time).format('HH:mm  -  DD/MM')}
                    </TableCell>
                    <TableCell align="left">{row.score == null ? 'Chưa thi đấu' : row.score}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Thành viên
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tên thành viên</TableCell>
                                            <TableCell>Mã số sinh viên</TableCell>
                                            <TableCell align="left">Giới tính</TableCell>
                                            <TableCell align="left">Vai trò</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.exhibitionPlayersDto.map((player) => (
                                            <TableRow key={player.id}>
                                                <TableCell component="th" scope="row">
                                                    {player.playerName}
                                                </TableCell>
                                                <TableCell>{player.playerStudentId}</TableCell>
                                                <TableCell align="left">{player.playerGender ? 'Nam' : 'Nữ'}</TableCell>
                                                <TableCell align="left">
                                                    {player.roleInTeam ? 'Trưởng nhóm' : ''}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
                <caption>Địa điểm thi đấu: {params.matches[0].areaName}</caption>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>STT</TableCell>
                        <TableCell>Tên đội</TableCell>
                        <TableCell>Thời gian thi đấu</TableCell>
                        <TableCell>Điểm số</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {params.matches.map((row, index) => (
                        <Row key={row.id} row={row} status={params.status} index={index} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TableMatch;
