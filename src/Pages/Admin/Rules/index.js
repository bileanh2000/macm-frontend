import { useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AddCircle } from '@mui/icons-material';

import ListRule from '../Rules/ViewRule/ListRule';

function Rules() {
    return (
        <Box sx={{ m: 1, p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500 }}>
                    Quản lý nội quy
                </Typography>
                <Button
                    variant="outlined"
                    sx={{ maxHeight: '50px', minHeight: '50px' }}
                    component={Link}
                    to={'./create'}
                    startIcon={<AddCircle />}
                >
                    Tạo nội quy mới
                </Button>
            </Box>
            <Divider />
            <Box sx={{ m: 2 }}>
                <ListRule />
            </Box>
        </Box>
    );
}

export default Rules;
