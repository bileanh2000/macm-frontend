import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Box } from '@mui/system';
import React, { Fragment } from 'react';

function MyTeam({ competitive, exhibition, user }) {
    console.log(exhibition, user);

    // const myTeam =
    //     exhibition.length > 0 &&
    //     exhibition.filter((ex) =>
    //         ex.exhibitionTeams.filter(
    //             (exhibitionTeam) =>
    //                 exhibitionTeam.exhibitionPlayers.filter(
    //                     (exhibitionPlayer) => exhibitionPlayer.tournamentPlayer.user.studentId == user.studentId,
    //                 )[0].tournamentPlayer.user.studentId == user.studentId,
    //         ),
    //     )[0].exhibitionTeams[0].exhibitionPlayers[0].tournamentPlayer.user.studentId;
    // const hehe =
    //     exhibition.length > 0 && exhibition[0].exhibitionTeams[0].exhibitionPlayers[0].tournamentPlayer.user.studentId;

    // console.log(myTeam);

    return competitive.length > 0 && exhibition.length > 0 ? (
        <>
            {competitive.length > 0 && <Typography variant="body1"></Typography>}{' '}
            {exhibition.length > 0 && (
                <>
                    <Typography variant="body1">Tên nhóm : {exhibition[0].teamName}</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="caption table">
                            <caption>{exhibition.data[0].name}</caption>
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
                                        <TableCell align="left">{row.playerGender ? 'Nam' : 'Nữ'}</TableCell>
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
