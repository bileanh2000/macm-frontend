import { LocationOn, LocalPhone, Email, Facebook, YouTube, Twitter, Instagram } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import adminContactAPI from 'src/api/adminContactAPI';

function Footer() {
    const [contacts, setContacts] = useState([]);
    const [socials, setSocials] = useState([]);

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
            <Grid item xs={4}></Grid>
        </Grid>
    );
}

export default Footer;
