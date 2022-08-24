import { Fragment, useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Divider,
    FormControl,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
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
    const [filterType, setFilterType] = useState(0);
    const [messages, setMessages] = useState('');

    let navigate = useNavigate();

    const getAllUpcomingActivities = async (filterType) => {
        try {
            const response = await dashboardApi.getAllUpcomingActivities(filterType);
            setUpcomingActivity(response.data);
            console.log('getAllUpcomingActivities', response);
            setMessages(response.message);
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
    const handleChange = (event) => {
        setFilterType(event.target.value);
    };

    useEffect(() => {
        getAllUpcomingActivities(filterType);
    }, [filterType]);

    if (messages === 'Sắp tới không có hoạt động nào') {
        return (
            <Box>
                <Typography sx={{ textAlign: 'center' }}>Sắp tới không có hoạt động nào!</Typography>
            </Box>
        );
    }
    return (
        <Fragment>
            <Box sx={{ mb: 0.5 }}>
                <Typography variant="h6" color="initial">
                    Hoạt động sắp tới
                </Typography>
                <FormControl size="small">
                    <Select
                        id="demo-simple-select"
                        value={filterType}
                        displayEmpty
                        onChange={handleChange}
                        variant="standard"
                    >
                        <MenuItem value={0}>1 tuần</MenuItem>
                        <MenuItem value={1}>1 tháng</MenuItem>
                        <MenuItem value={2}>1 kỳ</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ height: '296px', overflow: 'auto' }}>
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
