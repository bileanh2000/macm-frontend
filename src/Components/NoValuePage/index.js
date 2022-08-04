import { CircularProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';

function NoValuePage({ message }) {
    return (
        <Box sx={{ height: '80vh' }}>
            <Box
                sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '40%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                }}
            >
                <SearchOffRoundedIcon sx={{ fontSize: 50 }} />
                <Typography variant="h5">{message}</Typography>
            </Box>
        </Box>
    );
}

export default NoValuePage;
