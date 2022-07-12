import { Link, useParams } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import userApi from 'src/api/userApi';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import { Button, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { QrCode2 } from '@mui/icons-material';
import QRCode from './QRCode';

function UserProfile() {
    let { userId } = useParams();
    const [userDetail, setUserDetail] = useState([]);
    const [openQRDialog, setOpenQRDialog] = useState(false);
    const [QRUrl, setQRUrl] = useState('');

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const params = userId;
                console.log(params);
                const response = await userApi.getUserbyId(params);
                console.log(response);
                setUserDetail(response.data);
            } catch (error) {
                console.log('Failed to fetch user detail: ', error);
            }
        };
        const fetchUserQR = async (userDetail) => {
            try {
                const response = await userApi.generateQrCode(userDetail);
                setQRUrl(response.data[0]);
            } catch (error) {
                console.log('Failed to fetch user QR code: ', error);
            }
        };
        userDetail && fetchUserQR(userDetail);
        fetchUserDetail();
    }, []);

    const handleDialogOpen = () => {
        setOpenQRDialog(true);
    };

    return userDetail.map((item) => {
        return (
            <Fragment key={item.id}>
                <QRCode
                    title="Mã QR của bạn"
                    params={{ userDetail, QRUrl }}
                    isOpen={openQRDialog}
                    handleClose={() => {
                        setOpenQRDialog(false);
                    }}
                    onSucess={(newItem) => {
                        setOpenQRDialog(false);
                    }}
                />
                <Box component="div" sx={{ margin: 'auto', marginBottom: 12, position: 'relative', width: '95%' }}>
                    <Box component="div">
                        <img src="https://source.unsplash.com/random" alt="" width="100%" height="146px" />
                        <Avatar
                            alt="anh dai dien"
                            srcSet="https://scontent.fhan5-6.fna.fbcdn.net/v/t39.30808-6/281356576_3493649010862384_4475616120131758473_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=kYec_HK0aBIAX-gh-W3&_nc_ht=scontent.fhan5-6.fna&oh=00_AT-XfxH5kDkm71k41u2jR27-skqEJcsukxhuIPBdJGFVjQ&oe=62A8E9B7"
                            sx={{ width: 180, height: 180, position: 'absolute', top: 55, left: 16 }}
                        />
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<QrCode2 />}
                        sx={{ ml: 1, mt: 1, float: 'right' }}
                        onClick={handleDialogOpen}
                    >
                        Mã QR của bạn
                    </Button>
                </Box>

                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1 },
                        width: '80%',
                        margin: 'auto',
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Grid container spacing={6} columns={12}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" component="div">
                                Thông tin cá nhân
                            </Typography>
                            <TextField
                                disabled
                                id="outlined-disabled"
                                label="Họ và Tên"
                                defaultValue={item.name}
                                fullWidth
                            />
                            <TextField
                                disabled
                                id="outlined-disabled"
                                label="Mã sinh viên"
                                defaultValue={item.studentId}
                                fullWidth
                            />
                            <TextField
                                disabled
                                id="outlined-disabled"
                                label="Ngày sinh"
                                defaultValue={item.dateOfBirth}
                                fullWidth
                            />
                            <TextField
                                disabled
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
                            <TextField
                                disabled
                                id="outlined-disabled"
                                label="Email"
                                defaultValue={item.email}
                                fullWidth
                            />
                            <TextField
                                disabled
                                id="outlined-disabled"
                                label="Số điện thoại"
                                defaultValue={'0' + item.phone}
                                fullWidth
                            />
                            <TextField
                                disabled
                                id="outlined-disabled"
                                label="Địa chỉ hiện tại"
                                defaultValue={item.currentAddress}
                                fullWidth
                            />
                            {/* <TextField
                                disabled
                                id="outlined-disabled"
                                label="Chức vụ"
                                defaultValue={item.role.name}
                                fullWidth
                            /> */}
                            <Button variant="contained" color="success" component={Link} to="./edit">
                                Chỉnh sửa
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Fragment>
        );
    });
}

export default UserProfile;
