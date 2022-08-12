import { Fragment } from 'react';
import { Box, Paper, Tooltip, Typography } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function TournamentItem({ data }) {
    let navigator = useNavigate();

    return (
        <Fragment>
            <Box item sx={{ mb: 2 }}>
                <Paper
                    onClick={(event) => {
                        console.log(data.id);
                        navigator(`${data.id}`);
                    }}
                    elevation={2}
                    sx={{
                        padding: 2,
                        flexWrap: 'wrap',
                        transition: 'box-shadow 100ms linear',
                        cursor: 'pointer',

                        '&:hover': {
                            boxShadow: '0px 0px 16px 1px rgba(0,0,0,0.2)',
                            // opacity: [0.9, 0.8, 0.7],
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex' }}>
                            <Box
                                sx={{
                                    backgroundColor: '#F0F0F0',
                                    padding: 0.8,
                                    mr: 2,
                                    borderRadius: '10px',
                                    width: '50px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 1,
                                }}
                            >
                                {data.status === 3 ? (
                                    <EmojiEvents fontSize="large" sx={{ color: '#ffd24d' }} />
                                ) : data.status === 2 ? (
                                    <EmojiEvents fontSize="large" sx={{ color: '#6c86c6' }} />
                                ) : (
                                    <EmojiEvents fontSize="large" sx={{ color: '#758a8a' }} />
                                )}
                            </Box>
                            <Box>
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: '20px',
                                            lineHeight: '1.2',
                                            fontWeight: '500',
                                        }}
                                    >
                                        {data.name}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: '14px',
                                            lineHeight: '1.2',
                                            fontWeight: '500',
                                        }}
                                    >
                                        {moment(new Date(data.startDate)).format('DD/MM/yyyy')}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Fragment>
    );
}

export default TournamentItem;
