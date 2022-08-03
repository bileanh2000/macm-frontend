import React from 'react';
import { Box, Typography } from '@mui/material';
import moment from 'moment';

function PreviewData({ data }) {
    console.log(data);
    return (
        <Box component="div">
            <Typography variant="h5">
                <Typography variant="body1">
                    <strong>Tên giải đấu: </strong>
                    {data.tournamentName}
                </Typography>
            </Typography>
            <Typography variant="body1">
                <strong>Thời gian bắt đầu: </strong>
                {data.startDate}
            </Typography>
            <Typography variant="body1">
                <strong>Thời gian kết thúc: </strong>
                {data.finishDate}
            </Typography>
            <Typography variant="body1">
                <strong>Chi phí dự kiến: </strong>
                {Number(data.cost).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                })}
            </Typography>
            <Typography variant="body1">
                <strong>Số tiền dự kiến thu được từ ban tổ chức: </strong>
                {(data.numOfOrganizingCommitee * data.feeOrganizingCommiteePay).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                })}
            </Typography>
            <Typography variant="body1">
                <strong> Số tiền dự kiến thu được từ tuyển thủ: </strong>
                {(data.numOfParticipants * data.feePlayerPay).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                })}
            </Typography>
            <Typography variant="body1">
                <strong>Số tiền thu được dự kiến: </strong>
                {(
                    data.numOfOrganizingCommitee * data.feeOrganizingCommiteePay +
                    data.numOfParticipants * data.feePlayerPay
                ).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                })}
            </Typography>

            <Typography variant="body1">
                <strong>Số tiền tài trợ dự kiến từ câu lạc bộ: </strong>
                {data.totalAmountFromClubEstimate > 0
                    ? data.totalAmountFromClubEstimate.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                      })
                    : 'Không cần'}
            </Typography>
        </Box>
    );
}

export default PreviewData;
