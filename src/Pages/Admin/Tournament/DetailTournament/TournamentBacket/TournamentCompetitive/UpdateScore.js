import React, { useState } from 'react';
import {
    Box,
    TableBody,
    TableContainer,
    Tabs,
    Tooltip,
    TextField,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Button,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { useSnackbar } from 'notistack';

import adminTournament from 'src/api/adminTournamentAPI';

function UpdateScoreTournament({ winner, match, handleClose, WinnerTemp, onChangeData }) {
    const { enqueueSnackbar } = useSnackbar();
    const [score1, setScore1] = useState(1);
    const [score2, setScore2] = useState(0);
    const [winnerTemp, setWinnerTemp] = useState(WinnerTemp);

    const validationSchema = Yup.object().shape({
        score1: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn hoặc bằng 0')
            .max(10, 'Điếm số không được vượt quá 10'),

        score2: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn hoặc bằng 0')
            .max(10, 'Điếm số không được vượt quá 10'),
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setFocus,
        setError,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    });

    const handleUpdate = (data) => {
        if (data.score1 == data.score2) {
            setError('score1', {
                message: 'Điểm 2 người chơi không được bằng nhau',
            });
            setError('score2', {
                message: 'Điểm 2 người chơi không được bằng nhau',
            });
        } else {
            match.firstPlayer.point = data.score1;
            match.secondPlayer.point = data.score2;
            // setMatch(match);
            updateResult(match);
            handleClose();
        }
    };

    const updateResult = async (match) => {
        try {
            const res = await adminTournament.updateResultMatch(match);
            onChangeData && onChangeData();
            let variant = 'success';
            enqueueSnackbar(res.message, { variant });
        } catch (error) {
            let variant = 'error';
            enqueueSnackbar('khong the cap nhat ket quá', { variant });
        }
    };

    const handleChange = (score, event) => {
        score == 1 ? setScore1(Number(event)) : setScore2(Number(event));
        if (score == 1) {
            Number(event) > score2 ? setWinnerTemp(match.firstPlayer) : setWinnerTemp(match.secondPlayer);
        } else {
            Number(event) > score1 ? setWinnerTemp(match.secondPlayer) : setWinnerTemp(match.firstPlayer);
        }
    };

    return (
        <>
            {winner && (
                <Typography variant="body1">
                    Xác nhận{' '}
                    <strong>
                        {winner.studentName} - {winner.studentId}
                    </strong>{' '}
                    là người chiến thắng. Vui lòng nhập tỉ số
                </Typography>
            )}
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Tên vận động viên</TableCell>
                            <TableCell align="center">Điểm số</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                {match.firstPlayer.studentName} - {match.firstPlayer.studentId}
                            </TableCell>
                            <TableCell>
                                <Controller
                                    name="score1"
                                    variant="outlined"
                                    defaultValue={match.firstPlayer.point !== null ? match.firstPlayer.point : ''}
                                    control={control}
                                    render={({
                                        field: { onChange, value, onBlur },
                                        fieldState: { error, invalid },
                                    }) => (
                                        <NumberFormat
                                            name="score1"
                                            customInput={TextField}
                                            label="Điểm số"
                                            variant="outlined"
                                            defaultValue=""
                                            value={value}
                                            onValueChange={(v) => {
                                                onChange(Number(v.value));
                                            }}
                                            onBlur={(v) => handleChange(1, v.target.value)}
                                            error={invalid}
                                            helperText={invalid ? error.message : null}
                                            fullWidth
                                        />
                                    )}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                {match.secondPlayer.studentName} - {match.secondPlayer.studentId}
                            </TableCell>
                            <TableCell>
                                <Controller
                                    name="score2"
                                    variant="outlined"
                                    defaultValue={match.secondPlayer.point !== null ? match.secondPlayer.point : ''}
                                    control={control}
                                    render={({
                                        field: { onChange, value, onBlur },
                                        fieldState: { error, invalid },
                                    }) => (
                                        <NumberFormat
                                            name="score2"
                                            customInput={TextField}
                                            label="Điểm số"
                                            variant="outlined"
                                            defaultValue=""
                                            value={value}
                                            onValueChange={(v) => {
                                                onChange(Number(v.value));
                                            }}
                                            onBlur={(v) => handleChange(2, v.target.value)}
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
            <Box>
                {winner && winnerTemp && winnerTemp.studentId !== winner.studentId && (
                    <Typography variant="body1" sx={{ color: 'red' }}>
                        <strong>
                            {winnerTemp.studentName} - {winnerTemp.studentId}
                        </strong>{' '}
                        là người chiến thắng. Bạn xác nhận có đúng không?
                    </Typography>
                )}
                <Box sx={{ float: 'right' }}>
                    <Button variant="outlined" onClick={handleClose} sx={{ mr: 2 }}>
                        Hủy bỏ
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(handleUpdate)}>
                        Đồng ý
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default UpdateScoreTournament;
