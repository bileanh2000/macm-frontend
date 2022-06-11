import { LocationOn, LocalPhone, Email, Facebook, YouTube, Twitter } from '@mui/icons-material';
import { Grid } from '@mui/material';


function Footer() {
    return (

        <Grid container spacing={2}>
            <Grid item xs={8}>
                <Grid container spacing={0}>
                    <Grid item xs={2}>
                        <LocationOn />
                    </Grid>
                    <Grid item xs={10}>
                        <p>ĐH FPT, km29 Đại lộ Thăng Long, xã Thạch Hoà, huyện Thạch Thất Hà Nội</p>
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={2}>
                        <LocalPhone />
                    </Grid>
                    <Grid item xs={10}>
                        <p>(123) 456-7890</p>
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={2}>
                        <Email />
                    </Grid>
                    <Grid item xs={10}>
                        <p>macm@gmail.com</p>
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={2}>
                        <p>Mạng xã hội</p>
                    </Grid>
                    <Grid item xs={10} >
                        <Facebook />
                        <YouTube />
                        <Twitter />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={4}>
            </Grid>
        </Grid>

    );
}

export default Footer;