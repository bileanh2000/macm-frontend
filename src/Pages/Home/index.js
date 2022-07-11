import { Box, Button, Grid } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import News from './News/News'
import Schedule from './Schedule/Schedule'

function index() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Button>
                <Link to='/admin'>Chuyển sang trang quản trị</Link>
            </Button>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <News />
                </Grid>
                <Grid item xs={8} style={{ paddingRight: 16 }}>
                    <Schedule />
                </Grid>
            </Grid>
        </Box >

    )
}

export default index        