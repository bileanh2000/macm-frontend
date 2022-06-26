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

const UpdateCategoryDialog = ({ title, children, isOpen, handleClose, onSucess }) => {
    const [categoryList, setCategoryList] = useState([]);
    const [facilityList, setFacilityList] = useState([]);
    const [categoryId, setCategoryId] = useState(1);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [submittedData, setSubmitedData] = useState([]);
    // const [closeDialog, setCloseDialog] = useState(handleClose);

    const handleChangeCategory = (event) => {
        setCategoryId(event.target.value);
        console.log(event.target.value);
    };
    // const handleCloseDialog = ()=>{
    //     setCloseDialog(false);
    // }
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Không được để trống trường này'),
        // category: Yup.string().required('Không được để trống trường này'),
        quantityUsable: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        // quantityUsable: Yup.string()
        //     // .min(0, 'Vui lòng nhập giá trị lớn hơn 0')
        //     .required('Vui lòng không để trống trường này'),
    });

    const fetchFacilityCategory = async () => {
        try {
            const response = await facilityApi.getAllFacilityCategory();
            console.log(response.data);
            setCategoryList(response.data);
        } catch (error) {
            console.log('failed when fetch facility category', error);
        }
    };
    const fetchFacility = async (id) => {
        try {
            const response = await facilityApi.getAllFacilityByCategoryId(id);
            console.log(response.data);
            setFacilityList(response.data);
        } catch (error) {
            console.log('fetch facility failed', error);
        }
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };

    useEffect(() => {
        fetchFacilityCategory(categoryId);
    }, []);
    useEffect(() => {
        fetchFacility(categoryId);
    }, [categoryId]);
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const onSubmit = (data) => {
        console.log('data', data);
        setSubmitedData(data);
        const submitData = {
            facilityCategory: { id: categoryId },
            name: data.name,
            quantityUsable: data.quantityUsable,
        };
        console.log(submitData);
        facilityApi.createNewFacility(submitData).then((res) => {
            console.log(res);
            if (res.data.length != 0) {
                setOpenSnackBar(true);
                // setSnackBarStatus(true);
                snackBarStatus = true;
                dynamicAlert(snackBarStatus, res.message);
                onSucess && onSucess(res.data[0]);
            } else {
                console.log('huhu');
                setOpenSnackBar(true);
                // setSnackBarStatus(false);
                snackBarStatus = false;
                dynamicAlert(snackBarStatus, 'Thêm CSVC thất bại, vui lòng thử lại');
            }
        });
    };

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
            // reset({ name: '', quantity: '' });
        }
    }, [formState, submittedData, reset]);
    return (
        <Fragment>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={3000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackBar}
                    variant="filled"
                    severity={customAlert.severity || 'success'}
                    sx={{ width: '100%' }}
                >
                    {customAlert.message}
                </Alert>
            </Snackbar>
            <Dialog
                fullWidth
                maxWidth="md"
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description">{children}</DialogContentText> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSubmit(onSubmit)} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default UpdateCategoryDialog;
