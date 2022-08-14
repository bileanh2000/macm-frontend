import React, { useEffect, useState } from 'react';
import {
    Button,
    Chip,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Icon,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import moment from 'moment';
import { Box } from '@mui/system';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import NumberFormat from 'react-number-format';
import { KeyboardArrowDown, KeyboardArrowUp, SportsScore } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import adminTournament from 'src/api/adminTournamentAPI';

function TableMatch(params) {
    console.log(params.matches);
    const [matches, setMatches] = useState(params.matches);
    const [match, setMatch] = useState();
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setMatches(params.matches);
    }, [params.matches]);

    const updateResult = async (exhibitionTeamId, score) => {
        try {
            const res = await adminTournament.updateExhibitionResult(exhibitionTeamId, score);
            let variant = 'success';
            enqueueSnackbar(res.message, { variant });
        } catch (error) {
            let variant = 'error';
            enqueueSnackbar('Không thể cập nhật điểm số', { variant });
        }
    };

    const validationSchema = Yup.object().shape({
        score: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(1, 'Vui lòng nhập giá trị lớn hơn 0'),
    });

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const handleClickResult = (data) => {
        console.log(data);
        setMatch(data);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset({
            score: 0,
        });
    };

    const handleUpdate = (data) => {
        console.log(data, match);
        updateResult(match.team.id, data.score);
        const newMatches = matches.map((m) => {
            return m.team.id == match.team.id ? { ...m, score: data.score } : m;
        });
        setMatches(newMatches);
        params.onUpdateResult(newMatches);
        handleClose();
    };

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
                    <TableCell align="left">{row.team.teamName}</TableCell>
                    <TableCell align="left">{moment(row.time).format('hh:mm  -  DD/MM')}</TableCell>
                    <TableCell align="left">{row.score == null ? 'Chưa thi đấu' : row.score}</TableCell>
                    {/* {params.status === 2 && <TableCell align="left"></TableCell>} */}
                    {status >= 2 && (
                        <TableCell align="left">
                            <Chip
                                icon={<SportsScore />}
                                label={row.score == null ? 'Cập nhật điểm số' : 'Đã cập nhật'}
                                clickable={row.score == null ? true : false}
                                onClick={() => handleClickResult(row)}
                            />
                        </TableCell>
                    )}
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
                                        {row.team.exhibitionPlayers.map((player) => (
                                            <TableRow key={player.id}>
                                                <TableCell component="th" scope="row">
                                                    {player.tournamentPlayer.user.name}
                                                </TableCell>
                                                <TableCell>{player.tournamentPlayer.user.studentId}</TableCell>
                                                <TableCell align="left">
                                                    {player.tournamentPlayer.user.gender ? 'Nam' : 'Nữ'}
                                                </TableCell>
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
        <Box>
            <Dialog fullWidth maxWidth="lg" open={open}>
                {match && (
                    <div>
                        <DialogTitle>Điểm số</DialogTitle>
                        <DialogContent>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Tên đội</TableCell>
                                            <TableCell align="center">Điểm số</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center">{match.team.teamName}</TableCell>
                                            <TableCell>
                                                <Controller
                                                    name="score"
                                                    variant="outlined"
                                                    defaultValue=""
                                                    control={control}
                                                    render={({
                                                        field: { onChange, value, onBlur },
                                                        fieldState: { error, invalid },
                                                    }) => (
                                                        <NumberFormat
                                                            name="score"
                                                            customInput={TextField}
                                                            label="Điểm số"
                                                            variant="outlined"
                                                            defaultValue=""
                                                            value={value}
                                                            onValueChange={(v) => {
                                                                onChange(Number(v.value));
                                                            }}
                                                            error={invalid}
                                                            helperText={invalid ? error.message : null}
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Quay lại</Button>
                            <Button onClick={handleSubmit(handleUpdate)}>Đồng ý</Button>
                        </DialogActions>
                    </div>
                )}
            </Dialog>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                    <caption>Địa điểm thi đấu: {params.matches[0].area.name}</caption>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>STT</TableCell>
                            <TableCell align="left">Tên đội</TableCell>
                            <TableCell align="left">Thời gian thi đấu</TableCell>
                            <TableCell align="left">Điểm số</TableCell>
                            {/* {params.status === 2 && <TableCell align="left"></TableCell>} */}
                            {params.status === 3 && <TableCell align="left"></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {params.matches.map((row, index) => (
                            <Row key={row.id} row={row} status={params.status} index={index} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default TableMatch;
