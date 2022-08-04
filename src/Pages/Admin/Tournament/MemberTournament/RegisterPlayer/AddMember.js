import { Add, CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { Autocomplete, Box, Button, Checkbox, Collapse, Fab, Grid, Paper, TextField } from '@mui/material';
import React, { useState } from 'react';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

function AddMember(props) {
    const [user, setUser] = useState(props.data);

    const handleAddMember = (newValue) => {
        props.onAddPlayer(newValue);
    };

    return (
        <Box>
            <Grid container spacing={2} sx={{ p: 1 }}>
                <Grid item xs={8}>
                    <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={props.allMember}
                        value={user}
                        isOptionEqualToValue={(option, value) => option.studentId === value.studentId}
                        onChange={(event, newValue) => {
                            setUser(newValue);
                            handleAddMember(newValue);
                        }}
                        // getOptionDisabled={(options) => (user.length >= 1 ? true : false)}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.studentId}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {option.studentId} - {option.name}
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

export default AddMember;
