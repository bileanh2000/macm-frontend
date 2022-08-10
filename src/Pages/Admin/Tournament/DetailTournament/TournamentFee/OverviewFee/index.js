import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

function OverviewFee({ value, index, tournament, tournamentStatus }) {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            <Grid container columns={12} sx={{ mt: 2, ml: 0 }} spacing={2}>
                <Grid item xs={7}>
                    <Typography variant="body1" sx={{ p: 2, m: 1 }}>
                        <strong>Chi phí dự kiến: </strong>
                        {tournament.totalAmountEstimate?.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}
                    </Typography>
                    <Typography variant="body1" sx={{ p: 2, m: 1 }}>
                        <strong>Câu lạc bộ tài trợ(dự kiến): </strong>
                        {tournament.totalAmountFromClubEstimate?.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}
                    </Typography>
                    {tournament.feeOrganizingCommiteePay > 0 ? (
                        <Typography variant="body1" sx={{ p: 2, m: 1 }}>
                            <strong>Số tiền người trong ban tổ chức cần đóng: </strong>
                            {tournament.feeOrganizingCommiteePay?.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </Typography>
                    ) : (
                        ''
                    )}
                    {tournament.feePlayerPay > 0 ? (
                        <Typography variant="body1" sx={{ p: 2, m: 1 }}>
                            <strong>Số tiền người chơi cần đóng: </strong>
                            {tournament.feePlayerPay?.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </Typography>
                    ) : (
                        ''
                    )}
                </Grid>
                {/*<Grid item xs={5}>
                     {!isUpdate && (
                        <Button
                            variant="outlined"
                            startIcon={<Edit />}
                            sx={{ float: 'right' }}
                            onClick={() => setOpenEditDialog(true)}
                        >
                            Chỉnh sửa
                        </Button>
                    )} */}
                {/* {openEditDialog && (
                        <UpdateTournamentOverview
                            // DialogOpen={true}
                            data={tournament}
                            title="Cập nhật thông tin giải đấu"
                            isOpen={openEditDialog}
                            handleClose={() => {
                                setOpenEditDialog(false);
                                // reload();
                            }}
                            onSuccess={(newItem) => {
                                onUpdateTournament(newItem);
                                setOpenEditDialog(false);
                            }}
                            startTime={startTime}
                        />
                    )} 
                </Grid>*/}
            </Grid>
        </Box>
    );
}

export default OverviewFee;
