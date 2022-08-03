import { Add, CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { Autocomplete, Box, Button, Checkbox, Chip, Collapse, Fab, Grid, Paper, TextField } from '@mui/material';
import React, { Fragment, useState } from 'react';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

function AddMember(props) {
    const [isChecked, setIsChecked] = useState(false);
    const fixedOptions = [props.fixedOptions];
    // const fixedOptions = [{ gender: true, studentId: 'HE150001', studentName: 'dam van toan 22' }];
    const [user, setUser] = useState(props.data);

    const handleAddMember = () => {
        if (props.gender === 0) {
            props.onAddMale(user);
        } else {
            props.onAddFemale(user);
        }
        setIsChecked(!isChecked);
    };

    const handleCancel = () => {
        setIsChecked(!isChecked);
    };

    return (
        <Box>
            <Paper elevation={3}>
                <Collapse in={isChecked}>
                    <Grid container spacing={2} sx={{ p: 1 }}>
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                id="checkboxes-tags-demo"
                                options={props.allMember}
                                value={user}
                                isOptionEqualToValue={(option, value) => option.studentId === value.studentId}
                                onChange={(event, newValue) => {
                                    setUser([...newValue.filter((option) => fixedOptions.indexOf(option) === -1)]);
                                }}
                                // freeSolo={user.length > 3 ? false : true}
                                getOptionDisabled={(options) =>
                                    props.gender === 0
                                        ? user.length >= props.numberMale
                                            ? true
                                            : false
                                        : user.length >= props.numberFemale
                                        ? true
                                        : false
                                }
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
                                        {option.studentId} - {option.studentName}
                                    </li>
                                )}
                                renderTags={(tagValue, getTagProps) =>
                                    tagValue.map((option, index) => (
                                        <Fragment key={index}>
                                            <Chip
                                                label={option.studentId}
                                                {...getTagProps({ index })}
                                                disabled={
                                                    fixedOptions.findIndex((fo) => fo.studentId == option.studentId) !==
                                                    -1
                                                }
                                            />
                                            {console.log(option)}
                                        </Fragment>
                                    ))
                                }
                                style={{ width: 500 }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Thành viên" placeholder="Thêm thành viên" />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} container spacing={2}></Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="success" onClick={handleAddMember} sx={{ m: 1 }}>
                                Thêm
                            </Button>
                            <Button variant="contained" color="warning" onClick={handleCancel}>
                                Hủy
                            </Button>
                        </Grid>
                    </Grid>
                </Collapse>
            </Paper>
            {(props.gender && props.numberMale == 0) || (props.gender == false && props.numberFemale == 0) ? (
                ''
            ) : (
                <Collapse in={!isChecked}>
                    <Fab color="primary" aria-label="add" onClick={() => setIsChecked(!isChecked)} size="medium">
                        <Add />
                    </Fab>
                </Collapse>
            )}
        </Box>
    );
}

export default AddMember;
