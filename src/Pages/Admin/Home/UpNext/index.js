import { Fragment, useState } from 'react';
import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import trainingScheduleApi from 'src/api/trainingScheduleApi';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { bn } from 'date-fns/locale';
import moment from 'moment';
import dashboardApi from 'src/api/dashboardApi';
import { useNavigate } from 'react-router-dom';

function UpNext({ isAdmin }) {
    const [upcomingActivity, setUpcomingActivity] = useState([]);
    let navigate = useNavigate();

    const getAllUpcomingActivities = async () => {
        try {
            const response = await dashboardApi.getAllUpcomingActivities();
            setUpcomingActivity(response.data);
            console.log('getAllUpcomingActivities', response);
        } catch (error) {
            console.log('failed at getAllUpcomingActivities:', error);
        }
    };

    const handleNavigate = (activityId, activityType) => {
        if (activityType === 1) {
            if (isAdmin) {
                navigate(`/admin/events/${activityId}`);
            } else {
                navigate(`/events/${activityId}`);
            }
        } else {
            if (isAdmin) {
                navigate(`/admin/tournament/${activityId}`);
            } else {
                navigate(`/tournament/${activityId}`);
            }
        }
    };

    useState(() => {
        getAllUpcomingActivities();
    }, []);
    return (
        <Fragment>
            <Typography variant="h6" color="initial">
                Hoạt động trong 1 tháng tới
            </Typography>
            <Box sx={{ height: '328px', overflow: 'auto' }}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {upcomingActivity.map((activity, index) => {
                        return (
                            <Fragment key={index}>
                                <ListItem
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => handleNavigate(activity.id, activity.type)}
                                >
                                    <ListItemAvatar>
                                        {activity.type === 1 ? (
                                            <Avatar sx={{ backgroundColor: '#16ce8e' }}>
                                                <CelebrationIcon />
                                            </Avatar>
                                        ) : (
                                            <Avatar sx={{ backgroundColor: '#f9d441' }}>
                                                <EmojiEventsRoundedIcon />
                                            </Avatar>
                                        )}
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={activity.name}
                                        secondary={moment(activity.date).format('DD/MM/YYYY')}
                                    />
                                </ListItem>
                                <Divider light />
                            </Fragment>
                        );
                    })}
                </List>
            </Box>
        </Fragment>
    );
}

export default UpNext;
