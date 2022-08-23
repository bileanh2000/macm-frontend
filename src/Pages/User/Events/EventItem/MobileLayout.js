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
import styles from './EventItem.module.scss';
import { Link, useNavigate } from 'react-router-dom';

import moment from 'moment';

import CelebrationIcon from '@mui/icons-material/Celebration';
import { Fragment, useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import eventApi from 'src/api/eventApi';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
function MobileEventItem({ data, onSuccess }) {
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
                            mb: 2,
                            padding: '16px 16px 16px 16px',
                            '&:hover': {
                                boxShadow: '0px 0px 16px 1px rgba(0,0,0,0.2)',
                                // opacity: [0.9, 0.8, 0.7],
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                transition: 'box-shadow 100ms linear',
                                cursor: 'pointer',

                                flexDirection: 'column',
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
                                                fontStyle: 'normal !important',
                                                fontWeight: '500 !important',
                                                color: '#4a4c4f !important',
                                                display: ' -webkit-box !important',
                                                WebkitLineClamp: '2 !important',
                                                WebkitBoxOrient: 'vertical !important',
                                                overflow: 'hidden !important',
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
                                    <Box sx={{}}>
                                        <Typography sx={{ fontSize: '16px', lineHeight: '1.2', fontWeight: '500' }}>
                                            {moment(new Date(data.eventDto.startDate)).format('DD/MM/yyyy')}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Box sx={{ ml: 2 }}>
                                {/* {data.join ? <div className={cx('joined')}>Đã đăng ký</div> : null} */}
                                {data.registerStatus === 'Đã chấp nhận' ? (
                                    <div className={cx('joined')}>Đăng ký thành công</div>
                                ) : data.registerStatus === 'Đang chờ duyệt' ? (
                                    <div className={cx('upcoming')}>Đang chờ duyệt</div>
                                ) : data.registerStatus === 'Đã từ chối' ? (
                                    <div className={cx('reject')}>Đã từ chối</div>
                                ) : null}
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default MobileEventItem;
