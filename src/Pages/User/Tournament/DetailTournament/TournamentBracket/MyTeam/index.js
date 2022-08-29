import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Box } from '@mui/system';
import React, { Fragment, useEffect, useState } from 'react';

import userTournamentAPI from 'src/api/userTournamentAPI';

function MyTeam({ tournament, competitive, exhibition, user }) {
    // console.log(exhibition, user);
    const [myteam, setMyTeam] = useState([]);

    useEffect(() => {
        const getMyTeam = async () => {
            try {
                const response = await userTournamentAPI.getMyTeam(tournament.id, user.studentId);
                console.log('setMyTeam', response);
                setMyTeam(response.data);
            } catch (error) {
                console.warn('Failed to get my team', error);
            }
        };
        getMyTeam();
    }, [tournament.id, user.studentId]);

    return myteam.length > 0 ? (
        myteam.map((team) => (
            <Box key={team.id}>
                <Typography variant="body1">Tên nhóm : {team.teamName}</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="caption table">
                        <caption>{team.exhibitionTypeName}</caption>
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
                            {team.exhibitionPlayersDto.map((row, index) => (
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
            </Box>
        ))
    ) : (
        <Box sx={{ d: 'flex' }}>
            <Typography variant="body1" sx={{ m: 'auto' }}>
                Bạn chưa đăng kí thi đấu.
            </Typography>
        </Box>
    );
}

export default MyTeam;
