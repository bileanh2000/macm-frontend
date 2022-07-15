import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';

function LoadingProgress() {
    return (
        <Box sx={{ height: '80vh' }}>
            <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%)' }}>
                <CircularProgress size="4rem" />
            </Box>
        </Box>
    );
}

export default LoadingProgress;
