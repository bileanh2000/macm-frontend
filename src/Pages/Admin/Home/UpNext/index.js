import { Fragment } from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';

function UpNext() {
    return (
        <Fragment>
            <Typography variant="h6" color="initial">
                Hoạt động sắp tới
            </Typography>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: '#16ce8e' }}>
                            <BeachAccessIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Đi chùa ăn năn hối cải" secondary="Jan 9, 2014" />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: '#f9d441' }}>
                            <EmojiEventsRoundedIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Giải đấu nội bộ FNC" secondary="Jan 9, 2014" />
                </ListItem>
            </List>
        </Fragment>
    );
}

export default UpNext;
