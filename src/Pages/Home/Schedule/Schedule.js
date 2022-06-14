import React, { useState } from 'react'
import classNames from 'classnames/bind'

import styles from './Schedule.module.scss'
import { FormControl, MenuItem, Select } from '@mui/material'

const cx = classNames.bind(styles)

function Schedule() {

    const [type, setType] = useState('All');

    const handleChange = (event) => {
        setType(event.target.value);
    };

    return (
        <div className={cx('schedule-container')}>
            <h2>Schedule</h2>
            <FormControl size='medium'>
                <Select
                    id="demo-simple-select"
                    value={type}
                    displayEmpty
                    onChange={handleChange}
                >
                    <MenuItem value="All">
                        <em>All</em>
                    </MenuItem>
                    <MenuItem value={'Event'}>Event</MenuItem>
                    <MenuItem value={'News'}>News</MenuItem>
                    <MenuItem value={'Schedule Training'}>Schedule Training</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
}

export default Schedule 