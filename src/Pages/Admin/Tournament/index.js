import React from 'react';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from '../Tournament/Tournament.module.scss';

const cx = classNames.bind(styles);

function Tournament() {
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Typography variant="h3">Quản lý giải đấu</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Button component={Link} to="./create" sx={{ float: 'right', marginRight: 10 }}>
                        Tạo giải đấu
                    </Button>
                </Grid>
            </Grid>
            <Box component="div">
                <Typography sx={{ textAlign: 'center' }}>Hiện đang không có giải đấu nào</Typography>
                <Box className={cx('tournament-container')}>
                    <Box className={cx('tournament-title')}>
                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid item xs={2}>
                                Trạng thái
                            </Grid>
                            <Grid item xs={6}>
                                Tên giải đấu
                            </Grid>
                            <Grid item xs={2}>
                                Thời gian
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton aria-label="edit" component={Link} to={``}>
                                    <Edit />
                                </IconButton>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton aria-label="delete" onClick={() => console.log('a')}>
                                    <Delete />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className={cx('tournament-actions')}>
                        <Button>Danh sách ban tổ chức</Button>
                        <Button>Danh sách người đăng kí</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Tournament;
