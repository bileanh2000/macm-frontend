import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import styles from '../Event.module.scss';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import eventApi from 'src/api/eventApi';

import moment from 'moment';

import CelebrationIcon from '@mui/icons-material/Celebration';
import { Fragment, useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';

const cx = classNames.bind(styles);

function EventItem({ data, onSuccess }) {
    const [eventOnclick, SetEventOnclick] = useState({ name: '', id: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`Bạn muốn xóa sự kiện "${eventOnclick.name}"?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        "{eventOnclick.name}" sẽ được xóa khỏi danh sách sự kiện!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Từ chối</Button>
                    <Button onClick={handleDelete(eventOnclick.id)} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
            <Box item sx={{ mb: 2 }}>
                <Paper
                    onClick={(event) => {
                        console.log(data.id);
                        navigator(`/admin/events/${data.id}`);
                    }}
                    elevation={2}
                    sx={{
                        padding: 2,
                        flexWrap: 'wrap',
                        transition: 'box-shadow 100ms linear',
                        cursor: 'pointer',

                        '&:hover': {
                            boxShadow: '0px 0px 16px 1px rgba(0,0,0,0.2)',
                            // opacity: [0.9, 0.8, 0.7],
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                                {data.status === 'Chưa diễn ra' ? (
                                    <CelebrationIcon fontSize="large" sx={{ color: '#ffd24d' }} />
                                ) : data.status === 'Đang diễn ra' ? (
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
                                        {data.name}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: '14px',
                                            lineHeight: '1.2',
                                            fontWeight: '500',
                                        }}
                                    >
                                        {moment(new Date(data.startDate)).format('DD/MM/yyyy')}
                                    </Typography>
                                    <Typography sx={{ fontSize: '14px', lineHeight: '1.2' }}>
                                        {data.amountPerMemberRegister === 0
                                            ? 'Không thu phí'
                                            : 'Dự kiến ' + data.amountPerMemberRegister.toLocaleString() + ' VND/người'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            {data.status === 'Chưa diễn ra' ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Tooltip title="Xóa sự kiện">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={(event) => {
                                                handleOpenDialog();
                                                SetEventOnclick({ name: data.name, id: data.id });
                                                event.preventDefault();
                                                event.stopPropagation();
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>

                                    {/* <Tooltip title="Chỉnh sửa">
                                        <IconButton
                                            aria-label="edit"
                                            component={Link}
                                            to={`${data.id}/edit`}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip> */}
                                </Box>
                            ) : (
                                ''
                            )}
                        </Box>
                    </Box>

                    {/* <Box sx={{ display: 'flex', mt: 1, justifyContent: 'flex-end' }}>
                    <Box sx={{}}>
                        {data.status === 'Chưa diễn ra' ? (
                            <div className={cx('upcoming')}>Sắp diễn ra</div>
                        ) : data.status === 'Đang diễn ra' ? (
                            <div className={cx('going-on')}>Đang diễn ra</div>
                        ) : (
                            <div className={cx('closed')}>Đã kết thúc</div>
                        )}
                    </Box>
                </Box> */}

                    {/* <Box sx={{}}>
        <Typography
            sx={{ fontSize: '16px', lineHeight: '1.2', fontWeight: '500' }}
        >
            {moment(new Date(data.eventDto.startDate)).format('DD/MM/yyyy')}
        </Typography>
    </Box> */}
                </Paper>
            </Box>
        </Fragment>
    );
}

export default EventItem;
