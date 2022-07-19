import { Box, Button, Grid, Typography } from '@mui/material';
import React, { Fragment, useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import News from './News/News';
import Schedule from './Schedule/Schedule';
import PaymentNotification from './PaymentNotification';

function Index() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState(false);
    const roleId = JSON.parse(localStorage.getItem('currentUser')).role.id;
    // setUserName(JSON.parse(localStorage.getItem('currentUser')).name);
    useEffect(() => {
        if (
            roleId === 1 ||
            roleId === 2 ||
            roleId === 3 ||
            roleId === 4 ||
            roleId === 5 ||
            roleId === 6 ||
            roleId === 7 ||
            roleId === 8 ||
            roleId === 9
        ) {
            setIsAdmin(true);
        }
    }, []);

    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                    <Typography variant="h5" component="span">
                        Xin chào, {JSON.parse(localStorage.getItem('currentUser')).name}
                    </Typography>
                    {isAdmin ? (
                        <Button>
                            <Link to="/admin">Chuyển sang trang quản trị</Link>
                        </Button>
                    ) : (
                        <Button>
                            <Link to="/admin">Chuyển sang trang quản trị</Link>
                        </Button>
                    )}
                </Box>

                <PaymentNotification />
                {/* <Typography variant="h6">Bạn đéo cần phải đóng tiền kỳ này</Typography> */}
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <News />
                </Grid>
                <Grid item xs={8} style={{ paddingRight: 16 }}>
                    <Schedule />
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default Index;
