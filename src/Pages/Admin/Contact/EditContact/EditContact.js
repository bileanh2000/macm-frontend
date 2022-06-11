import { Button, Box, TextField, Typography } from '@mui/material';
import { Link } from "react-router-dom";
import classNames from 'classnames/bind';

import styles from '../EditContact/EditContact.module.scss';
import { Facebook, Twitter, YouTube } from '@mui/icons-material';

const cx = classNames.bind(styles)

function EditContact() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('header')}>
                    <h1>Trang edit contact</h1>
                    <span>
                        <Button
                            variant="contained"
                            color="success"
                            style={{ marginRight: 20 }}
                        >
                            Xác nhận
                        </Button>
                        <Button variant="contained" color="error">
                            <Link to="/admin/contact">Hủy bỏ</Link>
                        </Button>
                    </span>
                </div>
                <div className={cx('content')}>
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
                            label="Tên câu lạc bộ"
                            defaultValue="Hello World"
                            helperText="Incorrect entry."
                            required
                        />
                        <TextField
                            fullWidth
                            id="outlined-error-helper-text fullWidth"
                            label="Email"
                            defaultValue="Hello World"
                            helperText="Incorrect entry."
                            required
                        />
                        <TextField
                            fullWidth
                            id="outlined-error-helper-text fullWidth"
                            label="Số điện thoại"
                            defaultValue="Hello World"
                            helperText="Incorrect entry."
                            required
                        />
                        <h3>Mạng xã hội</h3>
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
                        </Box>
                    </Box>
                </div>
            </div>
        </div>

    );
}

export default EditContact;