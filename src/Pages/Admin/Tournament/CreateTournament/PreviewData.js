import React from 'react';
import { Box, Typography } from '@mui/material';
import moment from 'moment';

function PreviewData({ data }) {
    return (
        <Box component="div">
            <Typography variant="h5">Tên giải đấu :{data.tournamentName}</Typography>
            <Typography variant="h6">
                Thời gian bắt đầu :{moment(new Date(data.startDate)).format('DD-MM-yyyy')}
            </Typography>
            <Typography variant="h6">
                Thời gian kết thúc :{moment(new Date(data.finishDate)).format('DD-MM-yyyy')}
            </Typography>
            <Typography variant="h6">
                {/* Tổng chi phí tổ chức :{data.cost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} */}
            </Typography>
            <Typography variant="h5">Tên giải đấu :{data.tournamentName}</Typography>
            <Typography variant="h5">Tên giải đấu :{data.tournamentName}</Typography>
        </Box>
    );
}

export default PreviewData;
