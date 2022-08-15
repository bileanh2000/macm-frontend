import { Button, Grid, TextField } from '@mui/material';
import React from 'react';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

function EditRole({ roleEdit, onEdit, onCancel }) {
    const validationSchema = Yup.object().shape({
        // roleName: Yup.string()
        //     .nullable()
        //     .required('Không được để trống trường này')
        //     .test('len', 'Không hợp lệ', (val) => val.length > 1)
        //     .matches(
        //         /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/,
        //         'Không hợp lệ: vui lòng nhập chữ',
        //     ),
        maxQuantity: Yup.number()
            .nullable()
            .required('Không được để trống trường này')
            .min(1, 'Vui lòng nhập giá trị lớn hơn 0')
            .max(1000, 'Số lượng không hợp lệ')
            .typeError('Không được để trống trường này'),
    });

    const handleAddEventRoles = (data) => {
        const newRole = { ...roleEdit, maxQuantity: data.maxQuantity };
        onEdit && onEdit(newRole);
    };

    const {
        register,
        handleSubmit,
        reset,
        control,
        resetField,
        setFocus,
        setError,
        clearErrors,
        formState: { errors, isDirty, isValid },
    } = useForm({
        resolver: yupResolver(validationSchema),

        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        id="outlined-basic"
                        label="Tên vai trò"
                        variant="outlined"
                        defaultValue={roleEdit.name}
                        fullWidth
                        // {...register('roleName')}
                        // error={errors.roleName ? true : false}
                        // helperText={errors.roleName?.message}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    {/* <TextField
                        id="outlined-basic"
                        label="Tên vai trò"
                        variant="outlined"
                        fullWidth
                        {...register('roleName')}
                        error={errors.roleName ? true : false}
                        helperText={errors.roleName?.message}
                    /> */}
                    {/* )} */}
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="outlined-multiline-flexible"
                        name="maxQuantity"
                        type="number"
                        control={control}
                        label="Số lượng"
                        defaultValue={roleEdit.maxQuantity}
                        // value={description}
                        fullWidth
                        {...register('maxQuantity')}
                        error={errors.maxQuantity ? true : false}
                        helperText={errors.maxQuantity?.message}
                    />
                    {/* <TextField label="" id="outlined-basic" variant="outlined" /> */}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" onClick={handleSubmit(handleAddEventRoles)} sx={{ mr: 1 }}>
                    Chỉnh sửa
                </Button>
                <Button variant="contained" color="error" onClick={() => onCancel && onCancel()}>
                    Hủy bỏ
                </Button>
            </Grid>
        </Grid>
    );
}

export default EditRole;
