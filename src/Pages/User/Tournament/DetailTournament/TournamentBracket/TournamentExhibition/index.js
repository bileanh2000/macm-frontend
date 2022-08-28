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
    Tooltip,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import adminTournament from 'src/api/adminTournamentAPI';
import TableMatch from './TableMatch';
import Gold from 'src/Components/Common/Material/Gold';
import Sliver from 'src/Components/Common/Material/Sliver';
import Brone from 'src/Components/Common/Material/Brone';
import LoadingProgress from 'src/Components/LoadingProgress';

function TournamentExhibition({ exhibition, result, type }) {
    console.log(type);
    const nowDate = moment(new Date()).format('yyyy-MM-DD');
    let { tournamentId } = useParams();
    const [exhibitionType, setExhibitionType] = useState(type);
    const [exhibitionTeam, setExhibitionTeam] = useState();
    const [listExhibitionType, setListExhibitionType] = useState([]);
    const [tournamentStatus, setTournamentStatus] = useState(-1);
    const [open, setOpen] = useState(false);
    const [myTeam, setMyTeam] = useState();
    const [tournamentResult, setTournamentResult] = useState();
    const [isRender, setIsRender] = useState(true);
    const [isRenderTotal, setIsRenderTotal] = useState(true);

    const handleChangeExhibitionType = (event) => {
        if (result && result.length > 0) {
            const _result =
                result.find((subResult) =>
                    subResult.data.length > 0
                        ? subResult.data.find((d) => d.exhibitionType.id == event.target.value)
                        : null,
                ) != null
                    ? result.find((subResult) =>
                          subResult.data.length > 0
                              ? subResult.data.find((d) => d.exhibitionType.id == event.target.value)
                              : null,
                      )
                    : null;
            setTournamentResult(_result ? _result.data[0].listResult : null);
        }
        setExhibitionType(event.target.value);
        // const team = exhibition.find((t) => t.exhibitionTypeId === event.target.value);
        // setMyTeam(team);
        let exType;
        if (event.target.value === 0) {
            exType = { exhibitionType: 0 };
        } else {
            exType = listExhibitionType.find((type) => type.id === event.target.value);
        }
        getExhibitionResult(exType.id);
    };

    const getExhibitionResult = async (exhibitionType) => {
        try {
            const response = await adminTournament.getExhibitionResult(exhibitionType);
            response.data.length > 0 ? setExhibitionTeam(response.data[0].listResult) : setExhibitionTeam();
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        const getExhibitionResult = async (exhibitionType) => {
            try {
                const response = await adminTournament.getExhibitionResult(exhibitionType);
                console.log('exhi', response.data[0]);
                response.data.length > 0 ? setExhibitionTeam(response.data[0].listResult) : setExhibitionTeam();
            } catch (error) {
                console.log('Failed to fetch user list: ', error);
            }
        };
        isRender && getExhibitionResult(exhibitionType);
        setIsRender(false);
    }, [isRender, exhibitionType, exhibitionTeam]);

    useEffect(() => {
        const fetchExhibitionType = async (tournamentId) => {
            try {
                const response = await adminTournament.getListExhibitionType(tournamentId);
                console.log(response);
                setListExhibitionType(response.data);
                // const team =
                //     exhibition.length > 0 && exhibition.find((t) => t.exhibitionTypeId === response.data[0].id);
                // setMyTeam(team);
                getExhibitionResult(response.data[0].id);
                setTournamentStatus(response.code);
                type == 0 && setExhibitionType(response.data[0].id);
                const _result =
                    result.find((subResult) =>
                        subResult.data.length > 0
                            ? subResult.data.find((d) => d.exhibitionType.id == response.data[0].id)
                            : null,
                    ) != null
                        ? result.find((subResult) =>
                              subResult.data.length > 0
                                  ? subResult.data.find((d) => d.exhibitionType.id == response.data[0].id)
                                  : null,
                          )
                        : null;
                setTournamentResult(_result ? _result.data[0].listResult : null);
                setIsRenderTotal(false);
            } catch (error) {
                console.log('Failed to fetch user list: ', error);
            }
        };
        isRenderTotal && fetchExhibitionType(tournamentId);
    }, [tournamentId, exhibitionType, result, type, exhibition, isRenderTotal]);

    const handleOpenTeam = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    Bảng đấu biểu diễn
                </Typography>
            </Box> */}

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
                {myTeam && (
                    <Button variant="outlined" onClick={() => handleOpenTeam(true)}>
                        Đội của tôi
                    </Button>
                )}
                {myTeam && (
                    <Dialog
                        open={open}
                        fullWidth
                        maxWidth="lg"
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">Nội dung thi đấu: {myTeam.exhibitionTypeName}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Typography variant="caption">Đội của tôi: {myTeam.teamName}</Typography>
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
                                        {myTeam.exhibitionPlayersDto.map((row, index) => (
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
            {tournamentResult && tournamentResult.length > 0 && (
                <Paper elevation={3} sx={{ m: 2, p: 2 }}>
                    <Typography variant="h6">Kết quả bảng đấu</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Tooltip title="Huy chương vàng">
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Gold />

                                <Typography variant="body1">
                                    {tournamentResult.filter((result) => result.rank == 1)[0].teamName}
                                </Typography>
                            </Box>
                        </Tooltip>
                        <Tooltip title="Huy chương bạc">
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Sliver />

                                <Typography variant="body1">
                                    {tournamentResult.filter((result) => result.rank == 2)[0].teamName}
                                </Typography>
                            </Box>
                        </Tooltip>
                        <Tooltip title="Huy chương đồng">
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Brone />

                                <Typography variant="body1">
                                    {tournamentResult.filter((result) => result.rank == 3)[0].teamName}
                                </Typography>
                            </Box>
                        </Tooltip>
                    </Box>
                </Paper>
            )}
            {exhibitionTeam ? (
                exhibitionTeam.length > 0 ? (
                    <TableMatch matches={exhibitionTeam} status={tournamentStatus} />
                ) : (
                    <Box sx={{ d: 'flex' }}>
                        <Typography variant="body1" sx={{ m: 'auto' }}>
                            Thể thức này chưa có thời gian và địa điểm thi đấu
                        </Typography>
                    </Box>
                )
            ) : (
                <LoadingProgress />
            )}
        </Fragment>
    );
}

export default TournamentExhibition;
