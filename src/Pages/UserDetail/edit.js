import { useParams } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import userApi from 'src/api/userApi';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import DateFnsUtils from '@date-io/date-fns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function UserDetailEdit() {
    let { userId } = useParams();
    const [userDetail, setUserDetail] = useState([]);
    const [age, setAge] = useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const params = userId;
                const response = await userApi.getUserbyId(params);
                console.log(response);
                setUserDetail(response.data);
            } catch (error) {
                console.log('Failed to fetch user detail: ', error);
            }
        };
        fetchUserDetail();
    }, []);

    const Input = styled('input')({
        display: 'none',
    });
    const [value, setValue] = useState(new Date('2014-08-18T21:11:54'));
    return userDetail.map((item) => {
        return (
            <Fragment key={item.id}>
                <Box component="div" sx={{ marginBottom: 12, position: 'relative' }}>
                    <Box component="div">
                        <img src="https://source.unsplash.com/random" alt="" width="100%" height="146px" />
                        <Avatar
                            alt="anh dai dien"
                            srcSet="https://scontent.fhan5-6.fna.fbcdn.net/v/t39.30808-6/281356576_3493649010862384_4475616120131758473_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=kYec_HK0aBIAX-gh-W3&_nc_ht=scontent.fhan5-6.fna&oh=00_AT-XfxH5kDkm71k41u2jR27-skqEJcsukxhuIPBdJGFVjQ&oe=62A8E9B7"
                            sx={{ width: 180, height: 180, position: 'absolute', top: 55, left: 16 }}
                        />
                    </Box>
                </Box>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1 },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Grid container spacing={6} columns={12}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" component="div">
                                Thông tin cá nhân
                            </Typography>
                            <TextField id="outlined-disabled" label="Họ và Tên" defaultValue={item.name} fullWidth />
                            <TextField
                                id="outlined-disabled"
                                label="Mã sinh viên"
                                defaultValue={item.studentId}
                                fullWidth
                            />
                            <TextField
                                id="outlined-disabled"
                                label="Ngày sinh"
                                defaultValue={item.dateOfBirth}
                                fullWidth
                            />

                            {/* <LocalizationProvider dateAdapter={DateFnsUtils}>
                                <DesktopDatePicker
                                    label="Date desktop"
                                    inputFormat="MM/dd/yyyy"
                                    value={value}
                                    onChange={handleChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider> */}
                            <TextField
                                id="outlined-disabled"
                                label="Giới tính"
                                defaultValue={item.gender ? 'Nam' : 'Nữ'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" component="div">
                                Liên hệ
                            </Typography>
                            <FormControl fullWidth>
                                <TextField id="outlined-disabled" label="Email" defaultValue={item.email} />
                                <TextField
                                    id="outlined-disabled"
                                    label="Số điện thoại"
                                    defaultValue={'0' + item.phone}
                                />
                                <TextField
                                    id="outlined-disabled"
                                    label="Địa chỉ hiện tại"
                                    defaultValue={item.currentAddress}
                                />
                            </FormControl>

                            <FormControl fullWidth sx={{ margin: '8px', width: '-webkit-fill-available' }}>
                                <InputLabel id="demo-simple-select-label">Chức vụ</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={age}
                                    label="Chức vụ"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: '8px', mt: '8px' }}>
                        <label htmlFor="contained-button-file">
                            <Input type="submit" />
                            <Button variant="contained" component="span">
                                Xác nhận
                            </Button>
                        </label>
                    </Box>
                </Box>
            </Fragment>
        );
    });

    // return userDetail.map((item) => {
    //
    // });
}

export default UserDetailEdit;
