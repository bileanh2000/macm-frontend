import { useEffect, useState } from 'react';
import { Button, Box, TextField } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import classNames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import styles from '../EditContact/EditContact.module.scss';
import adminContactAPI from 'src/api/adminContactAPI';

const cx = classNames.bind(styles)

function EditContact() {
    const history = useNavigate()
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [contacts, setContacts] = useState([])

    const fetchContacts = async () => {
        try {
            const response = await adminContactAPI.getContact();
            console.log(response);
            setContacts(response.data);
            return response.data
        } catch (error) {
            console.log('Failed to fetch contacts list: ', error);
        }
    };
    useEffect(() => {
        fetchContacts()
    }, []);


    const validationSchema = Yup.object().shape({
        clubName: Yup.string().required('Không được để trống trường này'),
        clubMail: Yup.string()
            .required('Không được để trống trường này')
            .matches(/^[\w]+@(gmail.com)/, 'Nhập đúng định dạng mail'),
        clubPhoneNumber: Yup.string()
            .required('Không được để trống trường này')
            .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };

    const onSubmit = async (data) => {
        await adminContactAPI.updateContact(data).then((res) => {
            console.log('1', res);
            console.log('2', res.data);
            if (res.data != null) {
                setOpenSnackBar(true);
                history("/admin/contact")
            } else {
                console.log('huhu');
            }
        });

        console.log('submit', data);
    };

    return (
        <div className={cx('wrapper')}>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={5000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: '100%' }}>
                    Sửa thành công trang liên hệ
                </Alert>
            </Snackbar>
            <div className={cx('container')}>
                <div className={cx('header')}>
                    <h1>Trang edit contact</h1>
                </div>
                <div className={cx('content')}>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '100%' },
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        {contacts.length > 0 && (
                            <div>
                                <TextField
                                    fullWidth
                                    id="outlined-error-helper-text fullWidth"
                                    label="Tên câu lạc bộ"
                                    {...register('clubName')}
                                    error={errors.clubName ? true : false}
                                    defaultValue={contacts[0]?.clubName}
                                    helperText={errors.clubName?.message}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    id="outlined-error-helper-text fullWidth"
                                    label="Email"
                                    {...register('clubMail')}
                                    error={errors.clubMail ? true : false}
                                    defaultValue={contacts[0]?.clubMail}
                                    helperText={errors.clubMail?.message}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    id="outlined-error-helper-text fullWidth"
                                    label="Số điện thoại"
                                    {...register('clubPhoneNumber')}
                                    error={errors.clubPhoneNumber ? true : false}
                                    defaultValue={contacts[0]?.clubPhoneNumber}
                                    helperText={errors.clubPhoneNumber?.message}
                                    required
                                />
                            </div>
                        )}


                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: '8px', mt: '8px' }}>
                            <Button variant="contained" component="span" onClick={handleSubmit(onSubmit)}>
                                Lưu lại
                            </Button>
                            {/* <input type="submit" /> */}
                            <Button variant="contained" color="error">
                                <Link to="/admin/contact">Hủy bỏ</Link>
                            </Button>
                        </Box>
                        {/* <h3>Mạng xã hội</h3>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Facebook sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField id="input-with-sx" label="With sx" variant="standard" />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <YouTube sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField id="input-with-sx" label="With sx" variant="standard" />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Twitter sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField id="input-with-sx" label="With sx" variant="standard" />
                        </Box> */}
                    </Box>
                </div>
            </div>
        </div>

    );
}

export default EditContact;