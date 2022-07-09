import { Box, TextField } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

function EditFee({ message, onDialog, params }) {

    const onSubmit = async (data) => {
        console.log('submit', data);
        params = data.cost
        console.log('passed', params);
        onDialog(true, params)
    };

    const validationSchema = Yup.object().shape({
        cost: Yup.string().required('Không được để trống trường này')
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    return (
        <div
            style={{
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                backgroundColor: "rgba(0,0,0,0.5)"
            }}
            onClick={() => onDialog(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px"
                }}
            >
                <h3 style={{ color: "#111", fontSize: "16px", margin: 20 }}>{message}</h3>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '100%' },
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <TextField
                        fullWidth
                        id="outlined-error-helper-text fullWidth"
                        label="Số tiền"
                        {...register('cost')}
                        error={errors.cost ? true : false}
                        defaultValue={params}
                        helperText={errors.cost?.message}
                        type='number'
                        required
                    />
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <button
                            onClick={() => onDialog(false)}
                            style={{
                                background: "while",
                                color: "black",
                                padding: "20px",
                                marginRight: "4px",
                                border: "1px solid black",
                                borderRadius: 5,
                                cursor: "pointer"
                            }}
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit(onSubmit)}
                            style={{
                                background: "black",
                                color: "white",
                                padding: "20px",
                                marginLeft: "4px",
                                border: "1px solid black",
                                borderRadius: 5,
                                cursor: "pointer"
                            }}
                        >
                            Có, tôi chắc chắn
                        </button>
                    </div>
                </Box>

            </div>
        </div>
    );
}

export default EditFee