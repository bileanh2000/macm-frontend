import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    MenuItem,
    Snackbar,
    TextField,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import NumberFormat from 'react-number-format';
import facilityApi from 'src/api/facilityApi';
let snackBarStatus;

const ActiveRegister = ({
    title,
    facilityId,
    isOpen,
    handleClose,
    cateId,
    facilityName,
    quantityUsable,
    quantityBroken,
    onSuccess,
}) => {
    const [categoryList, setCategoryList] = useState([]);
    const [facility, setFacility] = useState([]);
    const [categoryId, setCategoryId] = useState(cateId);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [submittedData, setSubmitedData] = useState([]);
    // const [closeDialog, setCloseDialog] = useState(handleClose);

    const [usableQuantity, setUsableQuantity] = useState(quantityUsable);

    const handleChangeCategory = (event) => {
        setCategoryId(event.target.value);
        console.log(event.target.value);
    };

    return (
        <Fragment>
            <Dialog
                fullWidth
                maxWidth="md"
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent></DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleClose} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default ActiveRegister;
