import React, { Fragment, useState } from 'react';
import { Box, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material';
import EventFeePayment from './EventFeePayment';
import EventFeeReport from './EventFeeReport';

function EventFee({ event, isFinish, user, onChange }) {
    const [notiStatus, setNotiStatus] = useState(0);

    return (
        <Fragment>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ padding: '8px 8px 5px 8px' }}>
                    <ToggleButtonGroup
                        color="primary"
                        value={notiStatus}
                        exclusive
                        onChange={(event, newNotiStatus) => {
                            if (newNotiStatus !== null) {
                                setNotiStatus(newNotiStatus);
                                console.log(newNotiStatus);
                            }
                        }}
                    >
                        <ToggleButton
                            value={0}
                            sx={{
                                p: 1,
                                borderRadius: '10px !important',
                                border: 'none',
                                textTransform: 'none',
                                mr: 1,
                            }}
                        >
                            Trạng thái đóng tiền
                        </ToggleButton>
                        <ToggleButton
                            value={1}
                            sx={{
                                p: 1,
                                borderRadius: '10px !important',
                                border: 'none',
                                textTransform: 'none',
                            }}
                        >
                            Lịch sử đóng tiền
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                {notiStatus === 0 ? (
                    <EventFeePayment event={event} isFinish={isFinish} user={user} onChange={onChange} />
                ) : (
                    <EventFeeReport event={event} isFinish={isFinish} user={user} />
                )}
            </Box>
        </Fragment>
    );
}

export default EventFee;
