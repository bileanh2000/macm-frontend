import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';

function QRCode({ title, params, isOpen, handleClose }) {
    const download = (e) => {
        fetch(e, {
            method: 'GET',
            headers: {},
        })
            .then((response) => {
                response.arrayBuffer().then(function (buffer) {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'qrcode.png'); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={!!isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" sx={{ m: 'auto' }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <Grid container direction="row" justifyContent="center" alignItems="center">
                    <Grid item xs={12} textAlign="center">
                        <img src={params.QRUrl} alt="qrcode" />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {params.userDetail[0].name} - {params.userDetail[0].studentId}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={() => download(params.QRUrl)}>
                    <DownloadIcon />
                    Tải xuống
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default QRCode;
