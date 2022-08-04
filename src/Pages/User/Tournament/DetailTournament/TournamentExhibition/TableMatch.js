import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import moment from 'moment';

function TableMatch(params) {
    console.log(params);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
                <caption>Địa điểm thi đấu: {params.matches[0].area.name}</caption>
                <TableHead>
                    <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell align="right">Tên đội</TableCell>
                        <TableCell align="right">Thời gian thi đấu</TableCell>
                        <TableCell align="right">Điểm số</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {params.matches.map((row, index) => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell align="right">{row.team.teamName}</TableCell>
                            <TableCell align="right">{moment(row.time).format('hh:mm  -  DD/MM')}</TableCell>
                            <TableCell align="right">{row.score == null ? 'Chưa thi đấu' : row.score}</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TableMatch;
