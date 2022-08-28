import { Button } from '@mui/material';
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
import LoadingProgress from 'src/Components/LoadingProgress';

const cx = classNames.bind(styles);

function Contact() {
    const [contacts, setContacts] = useState([]);
    // const [socials, setSocials] = useState([]);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const fetchContacts = async () => {
        try {
            const response = await adminContactAPI.getContact();
            console.log(response);
            setContacts(response.data);
        } catch (error) {
            console.log('Failed to fetch contacts list: ', error);
        }
    };
    // const fetchSocial = async () => {
    //     try {
    //         const response = await adminContactAPI.getSocialNetwork();
    //         console.log(response);
    //         setSocials(response.data);
    //     } catch (error) {
    //         console.log('Failed to fetch social list: ', error);
    //     }
    // };
    useEffect(() => {
        fetchContacts();
        // fetchSocial();
        setIsUpdate(false);
    }, [isUpdate]);

    if (contacts.length === 0) {
        return <LoadingProgress />;
    }
    return (
        <IfAnyGranted
            expected={['ROLE_ViceHeadClub', 'ROLE_HeadClub', 'ROLE_HeadCommunication', 'ROLE_ViceHeadCommunication']}
            actual={JSON.parse(localStorage.getItem('currentUser')).role.name}
            unauthorized={<Navigate to="/forbidden" />}
        >
            {isOpenEditDialog && (
                <EditContactDialog
                    isOpen={isOpenEditDialog}
                    handleClose={() => {
                        console.log('hehe');
                        setIsOpenEditDialog(false);
                    }}
                    contacts={contacts}
                    onSucess={() => setIsUpdate(true)}
                />
            )}
            <div className={cx('header')}>
                <h1>Quản lý liên hệ</h1>
                <Button variant="outlined" onClick={() => setIsOpenEditDialog(true)}>
                    Chỉnh sửa thông tin liên hệ
                </Button>
            </div>
            <Container>
                <div className={cx('wrapper')}>
                    <div className={cx('container')}>
                        <ViewContact />
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <img
                                    src={contacts[0].image}
                                    alt="club logo"
                                    width="150px"
                                    height="150px"
                                    style={{ borderRadius: '50%' }}
                                />
                            </Grid>
                            <Grid item xs={10}>
                                <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{contacts[0]?.clubName}</p>

                                <p>{moment(contacts[0]?.foundingDate).format('DD/MM/yyyy')}</p>
                                <p>{contacts[0]?.clubMail}</p>
                                <p>{contacts[0]?.clubPhoneNumber}</p>
                                <div style={{ display: 'flex' }}>
                                    <a href={contacts[0]?.fanpageUrl} style={{ display: 'flex' }}>
                                        <Facebook />
                                        {contacts[0]?.fanpageUrl}
                                    </a>
                                    {/* <a href="##" style={{ color: 'black !important' }}>
                                        Le Anh Tuan
                                    </a> */}
                                </div>

                                <p>ĐH FPT, km29 Đại lộ Thăng Long, xã Thạch Hoà, huyện Thạch Thất Hà Nội</p>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Container>
        </IfAnyGranted>
    );
}

export default Contact;
