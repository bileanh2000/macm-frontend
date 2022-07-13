import { Fragment, useState } from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import trainingScheduleApi from 'src/api/trainingScheduleApi';
import { bn } from 'date-fns/locale';
import moment from 'moment';

function UpNext() {
    const [eventSchedule, setCommonList] = useState([]);
    const fetchCommonSchedule = async () => {
        try {
            const response = await trainingScheduleApi.commonSchedule();
            console.log('commonSchedule: ', response.data);
            let filterEvent = response.data.filter((item) => {
                return item.type !== 0;
            });
            let reverseEvent = filterEvent.sort((a, b) => a.id - b.id);

            let checkDublicate = reverseEvent.filter(
                (value, index, self) => index === self.findIndex((t) => t.title === value.title),
            );
            let reverseCheckDublicate = checkDublicate.sort((a, b) => b.id - a.id);
            let getTop2Event = reverseCheckDublicate.slice(0, 2);
            console.log('filterEvent', checkDublicate);
            setCommonList(getTop2Event);
        } catch (error) {
            console.log('failed at fetchCommonSchedule:', error);
        }
    };

    useState(() => {
        fetchCommonSchedule();
    }, []);
    return (
        <Fragment>
            <Typography variant="h6" color="initial">
                Hoạt động sắp tới
            </Typography>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {eventSchedule.map((event) => {
                    return (
                        <ListItem key={event.id}>
                            <ListItemAvatar>
                                {event.type === 1 ? (
                                    <Avatar sx={{ backgroundColor: '#16ce8e' }}>
                                        <BeachAccessIcon />
                                    </Avatar>
                                ) : (
                                    <Avatar sx={{ backgroundColor: '#f9d441' }}>
                                        <EmojiEventsRoundedIcon />
                                    </Avatar>
                                )}
                            </ListItemAvatar>
                            <ListItemText primary={event.title} secondary={moment(event.date).format('DD/MM/YYYY')} />
                        </ListItem>
                    );
                })}

                {/* <ListItem>
                    <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: '#f9d441' }}>
                            <EmojiEventsRoundedIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Giải đấu nội bộ FNC" secondary="Jan 9, 2014" />
                </ListItem> */}
            </List>
        </Fragment>
    );
}

export default UpNext;
