import { Fragment, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Divider,
    TextField,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import adminTournament from 'src/api/adminTournamentAPI';

function CreateRoleTournament({ isOpen, handleClose, onSucess, datas }) {
    const { enqueueSnackbar } = useSnackbar();

    const validationSchema = Yup.object().shape({
        roleName: Yup.string()
            .trim()
            .nullable()
            .required('Không được để trống trường này')
            .test('len', 'Không hợp lệ', (val) => val.length > 1)
            .matches(
                /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/,
                'Không hợp lệ: vui lòng nhập chữ',
            ),
    });

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    });

    const CreateRoleTournament = async (data) => {
        try {
            const response = await adminTournament.addNewRoleTournament(data.roleName);
            enqueueSnackbar(response.message, { variant: 'success' });
            onSucess && onSucess();
        } catch (error) {
            console.warn('Failed to create new rule');
        }
    };

    const handleCreateRoleTournament = async (data) => {
        if (datas.findIndex((d) => d.name.includes(data.roleName)) >= 0) {
            setError('roleName', {
                message: `Vai trò ${data.roleName} này đã tồn tại, vui lòng chọn vai trò khác`,
            });
            return;
        }
        const newData = { name: data.roleName };
        CreateRoleTournament(newData);
        reset({ roleName: '' });
        handleClose && handleClose();
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
                    Thêm mới vai trò trong ban tổ chức
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '100%' },
                        }}
                        Validate
                        autoComplete="off"
                    >
                        <TextField
                            fullWidth
                            id="outlined-error-helper-text fullWidth"
                            label="Tên vai trò"
                            {...register('roleName')}
                            error={errors.roleName ? true : false}
                            defaultValue=""
                            helperText={errors.roleName?.message}
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            handleClose && handleClose();
                            reset({ roleName: '' });
                        }}
                    >
                        Hủy
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(handleCreateRoleTournament)} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default CreateRoleTournament;
