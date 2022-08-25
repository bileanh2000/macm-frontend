import { Fragment, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Divider,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

function CreateArea({ isOpen, handleClose, onSucess, datas }) {
    const [isActive, setIsActive] = useState(1);

    const handleChange = (event) => {
        setIsActive(event.target.value);
    };
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .trim()
            .nullable()
            .required('Không được để trống trường này')
            .test('len', 'Không hợp lệ', (val) => val && val.length > 1),
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    });

    const handleCreateArea = (data) => {
        if (datas.findIndex((d) => d.name.toUpperCase().includes(data.name.toUpperCase())) >= 0) {
            setError('name', {
                message: `Sân ${data.name} này đã tồn tại, vui lòng chọn sân khác`,
            });
            return;
        }
        console.log(data, isActive);
        const newArea = { ...data, isActive: isActive == 1 ? true : false, id: Math.floor(Math.random() * 1000) + 100 };
        onSucess && onSucess(newArea);
    };

    return (
        <Fragment>
            <Dialog
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    Thêm sân thi đấu mới
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '100%' },
                            display: 'flex',
                        }}
                        Validate
                        autoComplete="off"
                    >
                        <TextField
                            fullWidth
                            id="outlined-error-helper-text fullWidth"
                            label="Tên sân"
                            {...register('name')}
                            error={errors.name ? true : false}
                            defaultValue=""
                            helperText={errors.name?.message}
                            required
                        />
                        <Select labelId="demo-simple-select-label" id="gender" value={isActive} onChange={handleChange}>
                            <MenuItem value={1}>Có thể sử dụng</MenuItem>
                            <MenuItem value={0}>Không thể sử dụng</MenuItem>
                        </Select>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(handleCreateArea)} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default CreateArea;
