import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import React, { Fragment, useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Schedule from './Schedule/Schedule';
import PaymentNotification from './PaymentNotification';
import News from './News/News';

import { getAllRole } from 'src/Roles/index';
import { IfAllGranted, IfAuthorized } from 'react-authorization';
import ForbiddenPage from '../ForbiddenPage';
import UpNext from '../Admin/Home/UpNext';

function Index() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [openNotificationDialog, setOpenNotificationDialog] = useState(false);

    const roleId = JSON.parse(localStorage.getItem('currentUser')).role.id;

    const handleOpenNotificationDialog = () => {
        setOpenNotificationDialog(true);
    };
    const handleCloseNotificationDialog = () => {
        // setAlreadyVisited(false);
        localStorage.removeItem('toShowPopup');
        setOpenNotificationDialog(false);
    };
    useEffect(() => {
        console.log(getAllRole);
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
        // localStorage.setItem('alreadyVisited', 'true');
        let visited = localStorage['toShowPopup'] !== 'true';

        if (!visited) {
            handleOpenNotificationDialog();
        }
    }, []);

    return (
        <Fragment>
            <Dialog
                open={openNotificationDialog}
                onClose={handleCloseNotificationDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description"></DialogContentText> */}
                    <PaymentNotification />
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={handleCloseNotificationDialog}>Disagree</Button> */}
                    <Button onClick={handleCloseNotificationDialog} autoFocus>
                        Thoát
                    </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                {/* <Typography variant="h6">Bạn đéo cần phải đóng tiền kỳ này</Typography> */}
            </Box>
            <Grid container spacing={2}>
                <Grid item md={10} xs={12} order={{ md: 1, xs: 2 }}>
                    <Schedule />
                </Grid>
                <Grid item md={2} xs={12} order={{ md: 2, xs: 1 }}>
                    <Grid item md={12}>
                        <News
                            name={JSON.parse(localStorage.getItem('currentUser')).name}
                            studentId={JSON.parse(localStorage.getItem('currentUser')).studentId}
                            roleName={JSON.parse(localStorage.getItem('currentUser')).role.name}
                            email={JSON.parse(localStorage.getItem('currentUser')).email}
                            isAdmin={isAdmin}
                        />
                    </Grid>
                    <Grid item md={12}>
                        <Paper sx={{ p: 2 }}>
                            <UpNext />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default Index;
