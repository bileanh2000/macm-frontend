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
import moment from 'moment';

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
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                padding: 1,
                                fontSize: '0.9rem',
                                justifyContent: 'center',
                            }}
                        >
                            <img
                                src={contacts[0]?.image}
                                alt="club logo"
                                width="150vw"
                                height="150vh"
                                style={{ borderRadius: '50%' }}
                            />
                            <Box>
                                <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{contacts[0]?.clubName}</p>

                                <p>{moment(contacts[0]?.foundingDate).format('DD/MM/yyyy')}</p>
                                <p>{contacts[0]?.clubMail}</p>
                                <p>{contacts[0]?.clubPhoneNumber}</p>
                                <div style={{ display: 'flex' }}>
                                    <a
                                        href={contacts[0]?.fanpageUrl}
                                        style={{ display: 'flex' }}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Facebook />
                                        {contacts[0]?.fanpageUrl}
                                    </a>
                                    {/* <a href="##" style={{ color: 'black !important' }}>
        Le Anh Tuan
    </a> */}
                                </div>

                                <p>ĐH FPT, km29 Đại lộ Thăng Long, xã Thạch Hoà, huyện Thạch Thất Hà Nội</p>
                            </Box>
                        </Box>
                    </div>
                </div>
            </Container>
        </Box>
    );
}

export default Contacts;
