import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField,
    Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment, useState } from 'react';
import { useSnackbar } from 'notistack';

import adminRuleAPI from 'src/api/adminRuleAPI';
import adminTournament from 'src/api/adminTournamentAPI';

function EditRoleTournament({ role, isOpen, handleClose, onSucess }) {
    const { enqueueSnackbar } = useSnackbar();

    // const [rule, setRule] = useState(_rule.description);

    const validationSchema = Yup.object().shape({
        roleName: Yup.string()
            .trim()
            .nullable()
            .required('Không được để trống trường này')
            .test('len', 'Không hợp lệ', (val) => val && val.length > 1)
            .matches(
                /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/,
                'Không hợp lệ: vui lòng nhập chữ',
            ),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    });

    const updateRule = async (data) => {
        try {
            const response = await adminTournament.updateRoleEventName(role.id, data.roleName);
            onSucess && onSucess();
            enqueueSnackbar(response.message, {
                variant: response.message.includes('thành công') ? 'success' : 'error',
            });
        } catch (error) {}
    };

    const onSubmit = async (data) => {
        const newData = { name: data.roleName };
        updateRule(newData);
        handleClose && handleClose();
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
                <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    Chỉnh sửa nội quy
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
                            defaultValue={role.name}
                            helperText={errors.roleName?.message}
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(onSubmit)} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default EditRoleTournament;
