import { Fragment } from 'react';
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

function ClubFee() {
    return (
        <Fragment>
            <Typography variant="h3" sx={{ paddingBottom: 10 }}>
                Quản lý tài chính câu lạc bộ
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={4}>
                    <Box
                        sx={{
                            minHeight: 250,
                            backgroundColor: 'antiquewhite',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                backgroundColor: 'primary.main',
                                opacity: [0.9, 0.8, 0.7],
                            },
                        }}
                        component={Link}
                        to={{ pathname: './membership' }}
                    >
                        <Typography variant="h6">Phí câu lạc bộ</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box
                        sx={{
                            minHeight: 250,
                            backgroundColor: 'antiquewhite',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                backgroundColor: 'primary.main',
                                opacity: [0.9, 0.8, 0.7],
                            },
                        }}
                        component={Link}
                        to={{ pathname: './event' }}
                    >
                        <Typography variant="h6">Phí sự kiện</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box
                        sx={{
                            minHeight: 250,
                            backgroundColor: 'antiquewhite',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                backgroundColor: 'primary.main',
                                opacity: [0.9, 0.8, 0.7],
                            },
                        }}
                        component={Link}
                        to={{ pathname: './facility' }}
                    >
                        <Typography variant="h6">Phí cơ sở vật chất</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box
                        sx={{
                            minHeight: 250,
                            backgroundColor: 'antiquewhite',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                backgroundColor: 'primary.main',
                                opacity: [0.9, 0.8, 0.7],
                            },
                        }}
                        component={Link}
                        to={{ pathname: './tournaments' }}
                    >
                        <Typography variant="h6">Phí giải đấu</Typography>
                    </Box>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default ClubFee;
