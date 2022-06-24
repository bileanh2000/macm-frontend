import {
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
    MenuItem,
    TextField,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState();

    const Input = styled('input')({
        display: 'none',
    });

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined);
            return;
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0]);
    };

    return (
        <div>
            {/* <input type="file" onChange={onSelectFile} /> */}
            {selectedFile && <img src={preview} alt="facility" />}
            <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" type="file" onChange={onSelectFile} />
                <Button sx={{ mt: 1 }} variant="outlined" component="span" startIcon={<PhotoCamera />}>
                    Tải ảnh lên
                </Button>
            </label>
        </div>
    );
};

const FacilityDialog = ({ title, children, isOpen, handleClose }) => {
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Không được để trống trường này'),
        maxQuantityComitee: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        numOfParticipants: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
    });
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });
    return (
        <Fragment>
            <Dialog
                fullWidth
                maxWidth="md"
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description">{children}</DialogContentText> */}
                    <Box
                        component={''}
                        sx={{
                            '& .MuiTextField-root': { mb: 2 },
                        }}
                    >
                        <Grid container columns={12} spacing={2}>
                            <Grid item xs={6}>
                                <ImageUpload />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    sx={{ mt: 1 }}
                                    required
                                    id="outlined-disabled"
                                    label="Tên cơ sở vật chất"
                                    fullWidth
                                    {...register('name')}
                                    error={errors.name ? true : false}
                                    helperText={errors.name?.message}
                                />
                                <TextField
                                    required
                                    select
                                    fullWidth
                                    defaultValue=""
                                    label="Cơ sở vật chất"
                                    {...register('facilityCategory')}
                                    error={errors.facilityCategory ? true : false}
                                    helperText={errors.facilityCategory?.message}
                                >
                                    <MenuItem value={1}>Giáp</MenuItem>
                                    <MenuItem value={2}>Găng</MenuItem>
                                </TextField>
                                <TextField
                                    sx={{ mt: 1 }}
                                    required
                                    id="outlined-disabled"
                                    label="Số lượng"
                                    fullWidth
                                    {...register('quantity')}
                                    error={errors.quantity ? true : false}
                                    helperText={errors.quantity?.message}
                                />
                                <TextField
                                    sx={{ mt: 1 }}
                                    required
                                    id="outlined-disabled"
                                    label="Đơn giá"
                                    fullWidth
                                    {...register('unitPrice')}
                                    error={errors.unitPrice ? true : false}
                                    helperText={errors.unitPrice?.message}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
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

export default FacilityDialog;
