import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import classNames from 'classnames/bind';
import styles from 'src/Pages/Admin/Event/Event.module.scss';
import { Link, useNavigate } from 'react-router-dom';

import moment from 'moment';

import CelebrationIcon from '@mui/icons-material/Celebration';
import { Fragment, useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import eventApi from 'src/api/eventApi';

function EventItem({ data, onSuccess }) {
    const [eventOnclick, SetEventOnclick] = useState({ name: '', id: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const cx = classNames.bind(styles);

    let navigator = useNavigate();

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleDelete = useCallback(
        (id) => () => {
            handleCloseDialog();
            setTimeout(() => {
                eventApi.deleteEvent(id).then((res) => {
                    if (res.data.length !== 0) {
                        console.log('delete', res);
                        console.log('delete', res.data);
                        enqueueSnackbar(res.message, { variant: 'success' });
                        handleCloseDialog();
                        onSuccess && onSuccess(id);
                    } else {
                        enqueueSnackbar(res.message, { variant: 'error' });
                        handleCloseDialog();
                    }
                });
                // const params = { studentId: id, semester: semester };
                // onSuccess && onSuccess(id);
                // eventApi.deleteEvent(id).then((res) => {
                //     console.log('delete', res);

                // });
            });
        },
        [],
    );
    return (
        <Fragment>
            <Grid justifyContent="center" container spacing={2}>
                <Grid item xs={12} md={8} key={data.eventDto.id}>
                    <Paper
                        onClick={() => {
                            console.log(data.eventDto.id);
                            navigator(`/events/${data.eventDto.id}`);
                        }}
                        elevation={2}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: 2,
                            flexWrap: 'wrap',
                            transition: 'box-shadow 100ms linear',
                            cursor: 'pointer',
                            mb: 2,
                            '&:hover': {
                                boxShadow: '0px 0px 16px 1px rgba(0,0,0,0.2)',
                                // opacity: [0.9, 0.8, 0.7],
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex' }}>
                            <Box
                                sx={{
                                    backgroundColor: '#F0F0F0',
                                    padding: 0.8,
                                    mr: 2,
                                    borderRadius: '10px',
                                    width: '50px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 1,
                                }}
                            >
                                {data.eventDto.status === 'Chưa diễn ra' ? (
                                    <CelebrationIcon fontSize="large" sx={{ color: '#ffd24d' }} />
                                ) : data.eventDto.status === 'Đang diễn ra' ? (
                                    <CelebrationIcon fontSize="large" sx={{ color: '#6c86c6' }} />
                                ) : (
                                    <CelebrationIcon fontSize="large" sx={{ color: '#758a8a' }} />
                                )}
                            </Box>
                            <Box>
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: '20px',
                                            lineHeight: '1.2',
                                            fontWeight: '500',
                                        }}
                                    >
                                        {data.eventDto.name}
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: 0.5 }}>
                                    <Typography sx={{ fontSize: '14px', lineHeight: '1.2' }}>
                                        {data.eventDto.amountPerMemberRegister === 0
                                            ? 'Không thu phí'
                                            : 'Dự kiến ' +
                                              data.eventDto.amountPerMemberRegister.toLocaleString() +
                                              ' VND/người'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flex: 1 }}>
                            {/* <Box sx={{ mr: 1.5, ml: 2 }}>
                                {data.eventDto.status === 'Chưa diễn ra' ? (
                                    <div className={cx('upcoming')}>Sắp diễn ra</div>
                                ) : data.eventDto.status === 'Đang diễn ra' ? (
                                    <div className={cx('going-on')}>Đang diễn ra</div>
                                ) : (
                                    <div className={cx('closed')}>Đã kết thúc</div>
                                )}
                            </Box> */}
                            <Box sx={{ ml: 2 }}>
                                {data.join ? <div className={cx('joined')}>Đã đăng ký</div> : null}
                            </Box>
                        </Box>

                        <Box sx={{}}>
                            <Typography sx={{ fontSize: '16px', lineHeight: '1.2', fontWeight: '500' }}>
                                {moment(new Date(data.eventDto.startDate)).format('DD/MM/yyyy')}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default EventItem;
