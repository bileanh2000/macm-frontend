import { Box, Button, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import styles from './Event.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
function Event() {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    Danh sách sự kiện
                </Typography>
                <Button
                    variant="outlined"
                    sx={{ maxHeight: '50px', minHeight: '50px' }}
                    component={Link}
                    to={'/admin/events/add'}
                    startIcon={<AddCircleIcon />}
                >
                    Thêm sự kiện mới
                </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '80%' }}>
                    <ul>
                        <li>
                            <div className={cx('event-list')}>
                                <div className={cx('event-status')}>
                                    <p className={cx('upcoming')}>Upcoming</p>
                                </div>
                                <div className={cx('event-title')}>Teambuilding Sapa 3 ngày 2 đêm</div>
                                <div className={cx('event-date')}>20/08/2022</div>
                                <div className={cx('event-action')}>
                                    <IconButton aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className={cx('event-list')}>
                                <div className={cx('event-status')}>
                                    <p className={cx('going-on')}>Going on</p>
                                </div>
                                <div className={cx('event-title')}>Teambuilding Sapa 3 ngày 2 đêm</div>
                                <div className={cx('event-date')}>20/08/2022</div>
                                <div className={cx('event-action')}>
                                    <IconButton aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className={cx('event-list')}>
                                <div className={cx('event-status')}>
                                    <p className={cx('closed')}>Closed</p>
                                </div>
                                <div className={cx('event-title')}>Teambuilding Sapa 3 ngày 2 đêm</div>
                                <div className={cx('event-date')}>20/08/2022</div>
                                <div className={cx('event-action')}>
                                    <IconButton aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </li>
                    </ul>
                </Box>
            </Box>
        </Box>
    );
}

export default Event;
