import { Box, Button, FormControl, Grid, MenuItem, Select, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import eventApi from 'src/api/eventApi';
import AddMemberToAdminEvent from './AddMemberToAdminEvent';
import AddMemberToEvent from './AddMemberToEvent';
import Header from './Header';
import MemberList from './MemberList';

function MenberEvent() {
    let { id } = useParams();
    const [type, setType] = useState(0);
    const [userList, setUserList] = useState([]);
    const [isOpenAddMemberDialog, setIsOpenAddMemberDialog] = useState(false);
    const [isUpdateRole, setisUpdateRole] = useState(false);

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                    <Button
                        variant="outlined"
                        // component={Link}
                        // to={`/admin/events/${id}/member/addmember`}
                        onClick={() => setIsOpenAddMemberDialog(true)}
                        sx={{ mr: 2 }}
                    >
                        Thêm thành viên vào sự kiện
                    </Button>
                    <Button
                        variant="outlined"
                        // component={Link}
                        // to={`/admin/events/${id}/member/addtoadmin`}
                        onClick={() => setisUpdateRole(true)}
                        sx={{ mr: 2 }}
                    >
                        Cập nhật thành viên ban tổ chức
                    </Button>
                    {/* <Button variant="contained">
                        <Link to="./addtoadmin">Điểm danh</Link>
                    </Button> */}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}></Box>
                <Link to={`../admin/events/${id}/membercancel`}>Danh sách thành viên hủy đăng ký tham gia sự kiện</Link>
            </Box>
            <MemberList data={userList} />
        </Fragment>
    );
}

export default MenberEvent;
