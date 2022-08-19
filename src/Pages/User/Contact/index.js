import { Box, Button, Typography } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { LocationOn, LocalPhone, Email, Facebook, YouTube, Twitter, Instagram } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import adminContactAPI from 'src/api/adminContactAPI';
import styles from './Contact.module.scss';
import ViewContact from './ViewContact';
import { IfAnyGranted } from 'react-authorization';
import EditContactDialog from './EditContact/EditContactDialog';
import { Container } from '@mui/system';

const cx = classNames.bind(styles);

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [socials, setSocials] = useState([]);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);

    const fetchContacts = async () => {
        try {
            const response = await adminContactAPI.getContact();
            console.log(response);
            setContacts(response.data);
        } catch (error) {
            console.log('Failed to fetch contacts list: ', error);
        }
    };
    const fetchSocial = async () => {
        try {
            const response = await adminContactAPI.getSocialNetwork();
            console.log(response);
            setSocials(response.data);
        } catch (error) {
            console.log('Failed to fetch social list: ', error);
        }
    };
    useEffect(() => {
        fetchContacts();
        fetchSocial();
    }, []);
    return (
        <Box sx={{ padding: 1 }}>
            <div className={cx('header')}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 4 }}>
                    Danh sách liên hệ
                </Typography>
            </div>
            <Container>
                <div className={cx('wrapper')}>
                    <div className={cx('container')}>
                        <ViewContact />
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={2}>
                                <img
                                    src="https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/68275017_653525195127933_5293448296403042304_n.png?_nc_cat=110&ccb=1-7&_nc_sid=174925&_nc_ohc=N_esqbEIiEAAX-uGB4V&_nc_ht=scontent.fhan5-8.fna&oh=00_AT-imS7k70wjPSUPuuNzg1Y_iiNXTKE_ZAg9gVzQ6pI_PA&oe=63262856"
                                    alt="club logo"
                                    width="100%"
                                    style={{ borderRadius: '50%' }}
                                />
                            </Grid>
                            <Grid item xs={10}>
                                {/* <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{contacts[0]?.clubName}</p> */}
                                <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>FNC - FPTU Nunchaku CLub</p>
                                <p>25/06/2019</p>
                                <p>{contacts[0]?.clubMail}</p>
                                <p>{contacts[0]?.clubPhoneNumber}</p>
                                <div style={{ display: 'flex' }}>
                                    <a href={socials[0]?.url}>
                                        <Facebook />
                                        {/* {socials[0]?.url} */}
                                    </a>
                                    <a href="##" style={{ color: 'black !important' }}>
                                        Le Anh Tuan
                                    </a>
                                </div>

                                <p>ĐH FPT, km29 Đại lộ Thăng Long, xã Thạch Hoà, huyện Thạch Thất Hà Nội</p>
                            </Grid>
                            {/* <Grid item xs={8}>
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
                                    <p>{contacts[0]?.clubPhoneNumber}</p>
                                </Grid>
                            </Grid>
                            <Grid container spacing={0}>
                                <Grid item xs={2}>
                                    <Email />
                                </Grid>
                                <Grid item xs={10}>
                                    <p>{contacts[0]?.clubMail}</p>
                                </Grid>
                            </Grid>
                            <Grid container spacing={0}>
                                <Grid item xs={2}>
                                    <p>Mạng xã hội</p>
                                </Grid>
                                <Grid item xs={10}>
                                    <a href={socials[0]?.url}>
                                        {' '}
                                        <Facebook />
                                    </a>
                                    <a href={socials[1]?.url}>
                                        {' '}
                                        <Instagram />
                                    </a>
                                    <a href={socials[2]?.url}>
                                        {' '}
                                        <YouTube />
                                    </a>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={4}></Grid> */}
                        </Grid>
                    </div>
                </div>
            </Container>
        </Box>
    );
}

export default Contacts;
