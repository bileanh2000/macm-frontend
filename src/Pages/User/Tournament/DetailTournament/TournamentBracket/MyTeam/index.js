import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Box } from '@mui/system';
import React, { Fragment } from 'react';

function MyTeam({ competitive, exhibition }) {
    console.log(competitive, exhibition);

    return competitive.length > 0 && exhibition.length > 0 ? (
        <>
            {competitive.length > 0 && <Typography variant="body1"></Typography>}{' '}
            {exhibition.length > 0 && (
                <>
                    <Typography variant="body1">Tên nhóm : {exhibition[0].teamName}</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="caption table">
                            <caption>{exhibition[0].exhibitionTypeName}</caption>
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell align="left">Tên thành viên</TableCell>
                                    <TableCell align="left">Mã số sinh viên</TableCell>
                                    <TableCell align="left">Giới tính</TableCell>
                                    <TableCell align="left">Vai trò</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {exhibition[0].exhibitionPlayersDto.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="left">{row.playerName}</TableCell>
                                        <TableCell align="left">{row.playerStudentId}</TableCell>
                                        <TableCell align="left">{row.playerGender == 0 ? 'Nam' : 'Nữ'}</TableCell>
                                        <TableCell align="left">{row.roleInTeam == 0 ? '' : 'Nhóm trưởng'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </>
    ) : (
        <Box sx={{ d: 'flex' }}>
            <Typography variant="body1" sx={{ m: 'auto' }}>
                Bạn chưa đăng kí thi đấu.
            </Typography>
        </Box>
    );
}

export default MyTeam;
