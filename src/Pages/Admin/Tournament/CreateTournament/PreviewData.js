import React from 'react';
import { Box, Typography } from '@mui/material';
import moment from 'moment';

function PreviewData({ data }) {
    console.log(data);
    return (
        <Box component="div">
            <Typography variant="h5">
                Tên giải đấu :<Typography variant="body1">{data.tournamentName}</Typography>
            </Typography>
            <Typography variant="h6">
                Thời gian bắt đầu :<Typography variant="body1">{data.startDate}</Typography>
            </Typography>
            <Typography variant="h6">
                Thời gian kết thúc :<Typography variant="body1">{data.finishDate}</Typography>
            </Typography>
            <Typography variant="h6">
                Chi phí dự kiến:{' '}
                <Typography variant="body1">
                    {Number(data.cost).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}
                </Typography>
            </Typography>
            <Typography variant="h6">
                Số tiền dự kiến thu được từ ban tổ chức:{' '}
                <Typography variant="body1">
                    {(data.numOfOrganizingCommitee * data.feeOrganizingCommiteePay).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}
                </Typography>
            </Typography>
            <Typography variant="h6">
                Số tiền dự kiến thu được từ tuyển thủ:{' '}
                <Typography variant="body1">
                    {(data.numOfParticipants * data.feePlayerPay).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}
                </Typography>
            </Typography>
            <Typography variant="h6">
                Số tiền thu được dự kiến:{' '}
                <Typography variant="body1">
                    {(
                        data.numOfOrganizingCommitee * data.feeOrganizingCommiteePay +
                        data.numOfParticipants * data.feePlayerPay
                    ).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}
                </Typography>
            </Typography>
            <Typography variant="h6">
                Số tiền tài trợ dự kiến từ câu lạc bộ:{' '}
                <Typography variant="body1">
                    {data.totalAmountFromClubEstimate > 0
                        ? data.totalAmountFromClubEstimate.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                          })
                        : 'Không cần'}
                </Typography>
            </Typography>
        </Box>
    );
}

export default PreviewData;
