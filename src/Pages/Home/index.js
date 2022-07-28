import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import React, { Fragment, useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Schedule from './Schedule/Schedule';
import PaymentNotification from './PaymentNotification';
import News from './News/News';
import userApi from 'src/api/userApi';

function Index() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState(false);
    const roleId = JSON.parse(localStorage.getItem('currentUser')).role.id;

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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                {/* <Box>
                    <Typography variant="h5" component="span">
                        Xin chào, {JSON.parse(localStorage.getItem('currentUser')).name}
                    </Typography>
                    {isAdmin ? (
                        <Button>
                            <Link to="/admin">Chuyển sang trang quản trị</Link>
                        </Button>
                    ) : (
                        ''
                    )}
                </Box> */}

                <PaymentNotification />
                {/* <Typography variant="h6">Bạn đéo cần phải đóng tiền kỳ này</Typography> */}
            </Box>
            <Grid container spacing={2}>
                <Grid item md={2} xs={12}>
                    <News
                        name={JSON.parse(localStorage.getItem('currentUser')).name}
                        studentId={JSON.parse(localStorage.getItem('currentUser')).studentId}
                        roleName={JSON.parse(localStorage.getItem('currentUser')).role.name}
                        email={JSON.parse(localStorage.getItem('currentUser')).email}
                        isAdmin={isAdmin}
                    />
                </Grid>
                <Grid item md={10} xs={12}>
                    <Schedule />
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default Index;
