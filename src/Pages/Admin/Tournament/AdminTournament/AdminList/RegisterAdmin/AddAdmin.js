import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Checkbox, Grid, TextField } from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

function AddAdmin(props) {
    const [admin, setAdmin] = useState(props.data);

    useEffect(() => {
        setAdmin(props.data);
    }, [props.data]);

    const handleAddMember = (newValue) => {
        console.log(newValue);
        props.onAddPlayer(newValue);
    };

    return (
        <Box>
            <Grid container spacing={2} sx={{ p: 1 }}>
                <Grid item xs={8}>
                    <Autocomplete
                        // key={props.data.length > 0}
                        multiple
                        id="checkboxes-tags-demo"
                        options={props.allMember}
                        value={admin}
                        isOptionEqualToValue={(option, value) => option.user.studentId === value.user.studentId}
                        onChange={(event, newValue) => {
                            setAdmin(newValue);
                            handleAddMember(newValue);
                        }}
                        // getOptionDisabled={(options) => (user.length >= 1 ? true : false)}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.user.studentId}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {option.user.studentId} - {option.user.name}
                            </li>
                        )}
                        style={{ width: 500 }}
                        renderInput={(params) => (
                            <TextField {...params} label="Thành viên" placeholder="Thêm thành viên" />
                        )}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default AddAdmin;
