import {
    Alert,
    Box,
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import { Fragment, useCallback, useEffect, useState } from 'react';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import NumberFormat from 'react-number-format';
import facilityApi from 'src/api/facilityApi';
import { Add, Delete } from '@mui/icons-material';
let snackBarStatus;

const UpdateCategoryDialog = ({ title, children, isOpen, handleClose, onSucess, onDelete }) => {
    const [categoryList, setCategoryList] = useState([]);
    const [facilityList, setFacilityList] = useState([]);
    const [categoryId, setCategoryId] = useState(1);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [submittedData, setSubmitedData] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({});

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

    // const onSubmit = (data) => {
    //     console.log('data', data);
    //     setSubmitedData(data);
    //     const submitData = {
    //         facilityCategory: { id: categoryId },
    //         name: data.name,
    //         quantityUsable: data.quantityUsable,
    //     };
    //     console.log(submitData);
    //     facilityApi.createNewFacility(submitData).then((res) => {
    //         console.log(res);
    //         if (res.data.length != 0) {
    //             setOpenSnackBar(true);
    //             // setSnackBarStatus(true);
    //             snackBarStatus = true;
    //             dynamicAlert(snackBarStatus, res.message);
    //             onSucess && onSucess(res.data[0]);
    //         } else {
    //             console.log('huhu');
    //             setOpenSnackBar(true);
    //             // setSnackBarStatus(false);
    //             snackBarStatus = false;
    //             dynamicAlert(snackBarStatus, 'Thêm CSVC thất bại, vui lòng thử lại');
    //         }
    //     });
    // };

    const handleAddCategory = (data) => {
        console.log(data);
        // setCategoryList((oldData) => {
        //     return [...oldData, data];
        // });
        facilityApi.createNewCategory(data).then((res) => {
            console.log(res.data);
            // categoryList && setCategoryList(...categoryList, res.data[0]);
            setCategoryList((prev) => {
                return [...prev, res.data[0]];
            });
            onSucess && onSucess(res.data[0]);
            reset({
                name: '',
            });
        });
    };

    const handleCancel = () => {
        setIsChecked(!isChecked);
        reset({
            name: '',
        });
    };

    const deleteCategory = useCallback(
        (id) => () => {
            setOpenConfirmDialog(false);
            setTimeout(() => {
                facilityApi.deleteCategory(id).then((res) => {
                    setCategoryList((prev) => prev.filter((row) => row.id !== id));
                    console.log('deleteCategory', res);
                    console.log('deleteCategory data', res.data);
                    onDelete && onDelete(id);
                });
            });
        },
        [],
    );
    useEffect(() => {
        if (formState.isSubmitSuccessful) {
            // reset({ name: '', quantity: '' });
        }
    }, [formState, submittedData, reset]);
    return (
        <Fragment>
            <Dialog
                open={openConfirmDialog}
                onClose={() => {
                    setOpenConfirmDialog(false);
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Xác nhận xóa cơ sở vật chất</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn muốn xóa "{selectedCategory.name}" ra khỏi danh sách cơ sở vật chất ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={deleteCategory(selectedCategory.id)} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
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
                maxWidth="xs"
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <TableContainer sx={{ maxHeight: 440, overflow: 'auto' }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Hạng mục</TableCell>
                                    <TableCell align="left"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categoryList.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => {
                                                    setOpenConfirmDialog(true);
                                                    setSelectedCategory({ id: item.id, name: item.name });
                                                }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Collapse in={isChecked}>
                        <TextField
                            fullWidth
                            autoFocus
                            sx={{ mt: 2, mb: 2 }}
                            size="small"
                            id="category"
                            label="Thêm danh mục"
                            variant="standard"
                            {...register('name')}
                            error={errors.name ? true : false}
                            helperText={errors.name?.message}
                        />

                        <Button
                            sx={{ mr: 2 }}
                            variant="contained"
                            color="success"
                            onClick={handleSubmit(handleAddCategory)}
                        >
                            Thêm
                        </Button>
                        <Button variant="contained" color="error" onClick={handleCancel}>
                            Hủy
                        </Button>
                    </Collapse>
                    <Collapse in={!isChecked} sx={{ mt: 2 }}>
                        <Fab color="primary" aria-label="add" onClick={() => setIsChecked(!isChecked)} size="small">
                            <Add />
                        </Fab>
                    </Collapse>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Quay lại</Button>
                    {/* <Button onClick={handleSubmit(onSubmit)} autoFocus>
                        Xác nhận
                    </Button> */}
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default UpdateCategoryDialog;
