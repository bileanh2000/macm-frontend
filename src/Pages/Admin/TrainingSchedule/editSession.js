import { Box, ButtonGroup, Button, Typography, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import vi from 'date-fns/locale/vi';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import trainingSchedule from 'src/api/trainingScheduleApi';

function UpdateSchedule() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(new Date());
    let { scheduleId } = useParams();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmDialog = () => {
        setOpen(false);
        trainingSchedule.deleteSession(scheduleId).then((res) => {
            console.log('1', res);
            console.log('2', res.data);
            console.log('3', res.message);
        });
    };

    return (
        <Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Xác nhận xóa!'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Bạn muốn xóa buổi tập này?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Từ chối</Button>
                    <Button onClick={handleConfirmDialog} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" color="initial">
                    Cập nhật buổi tập
                </Typography>
                <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={handleClickOpen}>
                    Xóa buổi tập
                </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                    <StaticDatePicker
                        orientation="landscape"
                        openTo="day"
                        value={value}
                        // shouldDisableDate={isWeekend}
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Box>
        </Box>
    );
}

export default UpdateSchedule;
