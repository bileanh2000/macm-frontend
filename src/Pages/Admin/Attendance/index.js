import React, { Fragment } from 'react'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import ViewAttendance from './ViewAttendance'

function Attendance() {
    return (
        <Fragment>
            <ViewAttendance />
            <Button><Link to='./take'>Điểm danh</Link></Button>
            <Button><Link to='./edit'>Chỉnh sửa</Link></Button>
        </Fragment>
    )
}

export default Attendance