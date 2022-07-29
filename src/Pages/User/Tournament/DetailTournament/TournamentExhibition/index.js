import React, { Fragment, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import adminTournament from 'src/api/adminTournamentAPI';
import TableMatch from './TableMatch';

function TournamentExhibition({ exhibition }) {
    const nowDate = moment(new Date()).format('yyyy-MM-DD');
    console.log(exhibition);
    let { tournamentId } = useParams();
    const [exhibitionType, setExhibitionType] = useState(0);
    const [exhibitionTeam, setExhibitionTeam] = useState([]);
    const [listExhibitionType, setListExhibitionType] = useState([]);
    const [tournamentStatus, setTournamentStatus] = useState(-1);
    const [open, setOpen] = useState(false);

    const handleChangeExhibitionType = (event) => {
        console.log(event.target.value);
        setExhibitionType(event.target.value);
        let exType;
        if (event.target.value === 0) {
            exType = { exhibitionType: 0 };
        } else {
            exType = listExhibitionType.find((type) => type.id === event.target.value);
        }
        console.log(exType);
        getExhibitionResult(exType.id, nowDate);
    };

    const fetchExhibitionType = async (tournamentId) => {
        try {
            const response = await adminTournament.getListExhibitionType(tournamentId);
            console.log(response);
            setListExhibitionType(response.data);
            setExhibitionType(response.data[0].id);
            getExhibitionResult(response.data[0].id, nowDate);
            setTournamentStatus(response.code);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const getExhibitionResult = async (exhibitionType, date) => {
        try {
            const response = await adminTournament.getExhibitionResult({ exhibitionType, date });
            console.log(response);
            setExhibitionTeam(response.data);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        getExhibitionResult(exhibitionType == 0 ? 0 : exhibitionType, nowDate);
        fetchExhibitionType(tournamentId);
    }, [tournamentId]);

    const handleOpenTeam = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    Bảng đấu biểu diễn
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                <FormControl size="small">
                    <Typography variant="caption">Thể thức thi đấu</Typography>
                    <Select
                        id="demo-simple-select"
                        value={exhibitionType}
                        displayEmpty
                        onChange={handleChangeExhibitionType}
                    >
                        {listExhibitionType &&
                            listExhibitionType.map((type) => (
                                <MenuItem value={type.id} key={type.id}>
                                    {type.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                {exhibition.length > 0 && (
                    <Button variant="outlined" onClick={() => handleOpenTeam(true)}>
                        Đội của tôi
                    </Button>
                )}
                {exhibition.length > 0 && (
                    <Dialog
                        open={open}
                        fullWidth
                        maxWidth="lg"
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Nội dung thi đấu: {exhibition[0].exhibitionTypeName}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Typography variant="caption">Đội của tôi: {exhibition[0].teamName}</Typography>
                            </DialogContentText>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                                    {/* <caption>Địa điểm thi đấu: {params.matches[0].area.name}</caption> */}
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
                                                <TableCell align="left">
                                                    {row.playerGender == 0 ? 'Nam' : 'Nữ'}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {row.roleInTeam == 0 ? '' : 'Nhóm trưởng'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} autoFocus>
                                Đóng
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>

            {exhibitionTeam && exhibitionTeam.length > 0 ? (
                <div>
                    <TableMatch matches={exhibitionTeam} status={tournamentStatus} />
                </div>
            ) : tournamentStatus == 1 ? (
                <Box sx={{ d: 'flex' }}>
                    <Typography variant="body1">Thể thức thi đấu này hiện đang chưa có tuyển thủ</Typography>
                </Box>
            ) : (
                <Box sx={{ d: 'flex' }}>
                    <Typography variant="body1" sx={{ m: 'auto' }}>
                        Thể thức thi đấu này không tổ chức
                    </Typography>
                </Box>
            )}
        </Fragment>
    );
}

export default TournamentExhibition;
