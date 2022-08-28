import {
    Box,
    Button,
    FormControl,
    Grid,
    MenuItem,
    Select,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import React, { Fragment, useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import eventApi from 'src/api/eventApi';
import AddMemberToAdminEvent from './AddMemberToAdminEvent';
import AddMemberToEvent from './AddMemberToEvent';
import Header from './Header';
import MemberCancelEvent from './MemberCancelEvent';
import MemberList from './MemberList';

function MenberEvent() {
    let { id } = useParams();
    const [type, setType] = useState(0);
    const [userList, setUserList] = useState([]);
    const [isOpenAddMemberDialog, setIsOpenAddMemberDialog] = useState(false);
    const [isMemberCancelDialog, setIsMemberCancelDialog] = useState(false);
    const [isUpdateRole, setisUpdateRole] = useState(false);
    const [notiStatus, setNotiStatus] = useState(0);

    const handleChangeType = (event) => {
        setType(event.target.value);
    };

    const fetchUserInEvent = async (params, index) => {
        try {
            const response = await eventApi.getAllMemberEvent(params, index);
            console.log(response);
            setUserList(response.data);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        fetchUserInEvent(id, 0);
    }, [id, type]);

    return (
        <Fragment>
            <AddMemberToEvent
                title="Thêm thành viên vào sự kiện"
                isOpen={isOpenAddMemberDialog}
                handleClose={() => setIsOpenAddMemberDialog(false)}
                onSucess={(newMembers) => {
                    // console.log(newMembers);
                    // newMembers.map((member) => {});
                    return setUserList([...newMembers, ...userList]);
                }}
            />

            <MemberCancelEvent
                title="Danh sách thành viên hủy tham gia sự kiện"
                isOpen={isMemberCancelDialog}
                handleClose={() => setIsMemberCancelDialog(false)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                    <Button variant="outlined" onClick={() => setIsOpenAddMemberDialog(true)} sx={{ mr: 2 }}>
                        Thêm thành viên vào sự kiện
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}></Box>
                {/* <Link to={`../admin/events/${id}/membercancel`}>Danh sách thành viên hủy đăng ký tham gia sự kiện</Link> */}
                <Button onClick={() => setIsMemberCancelDialog(true)}>Danh sách thành viên hủy đăng ký tham gia</Button>
            </Box>

            <ToggleButtonGroup
                color="primary"
                value={notiStatus}
                exclusive
                onChange={(event, newNotiStatus) => {
                    if (newNotiStatus !== null) {
                        setNotiStatus(newNotiStatus);
                        console.log(newNotiStatus);
                    }
                }}
                sx={{ mb: 1 }}
            >
                <ToggleButton
                    value={0}
                    sx={{
                        p: 1,
                        borderRadius: '10px !important',
                        border: 'none',
                        textTransform: 'none',
                        mr: 1,
                    }}
                >
                    DANH SÁCH THÀNH VIÊN THAM GIA
                </ToggleButton>
                <ToggleButton
                    value={1}
                    sx={{
                        p: 1,
                        borderRadius: '10px !important',
                        border: 'none',
                        textTransform: 'none',
                    }}
                >
                    XÉT DUYỆT THAM GIA
                </ToggleButton>
            </ToggleButtonGroup>

            {!notiStatus ? <MemberList data={userList} /> : <p> hehe</p>}
        </Fragment>
    );
}

export default MenberEvent;
