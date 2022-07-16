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
import { useParams } from 'react-router-dom';

import adminTournament from 'src/api/adminTournamentAPI';

function TournamentOverview() {
    let { tournamentId } = useParams();
    const [tournament, setTournament] = useState([]);

    const getTournamentById = async (tournamentId) => {
        try {
            const response = await adminTournament.getTournamentById(tournamentId);
            console.log(response.data);
            setTournament(response.data);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };
    useEffect(() => {
        getTournamentById(tournamentId);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [tournamentId]);

    return (
        <Fragment>
            {tournament &&
                tournament.map((item) => {
                    return (
                        <Fragment key={item.id}>
                            <Grid container columns={12} sx={{ mt: 2 }} spacing={2}>
                                <Grid item xs={7}>
                                    <Typography>Tên giải đấu</Typography>
                                    <Typography>Nội dung</Typography>
                                </Grid>
                            </Grid>
                            <Paper elevation={3}>
                                {item.competitiveTypes.length > 0 && (
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Typography variant="h6">
                                            <strong>Thi đấu đối kháng: </strong>
                                        </Typography>
                                        <TableContainer stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">Giới tính</TableCell>
                                                    <TableCell align="center">Hạng cân</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {item.competitiveTypes.map((data) => (
                                                    <TableRow key={data.id}>
                                                        <TableCell align="center">
                                                            {data.gender === 1 ? 'Nam' : 'Nữ'}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {data.weightMin} - {data.weightMax} Kg
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </TableContainer>
                                    </TableContainer>
                                )}
                            </Paper>
                            <Paper elevation={3}>
                                {item.exhibitionTypes.length > 0 && (
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Typography variant="h6">
                                            <strong>Thi đấu biểu diễn: </strong>
                                        </Typography>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">Nội dung thi đấu</TableCell>
                                                    <TableCell align="center">Số lượng nữ</TableCell>
                                                    <TableCell align="center">Số lượng nam</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {item.exhibitionTypes.map((data) => (
                                                    <TableRow key={data.id}>
                                                        <TableCell align="center">{data.name}</TableCell>
                                                        <TableCell align="center">{data.numberFemale}</TableCell>
                                                        <TableCell align="center">{data.numberMale}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Paper>
                        </Fragment>
                    );
                })}
        </Fragment>
    );
}
export default TournamentOverview;
