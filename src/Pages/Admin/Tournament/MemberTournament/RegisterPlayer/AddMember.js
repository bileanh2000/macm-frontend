import { Add, CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Collapse,
    createFilterOptions,
    Fab,
    Grid,
    Paper,
    TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

function AddMember(props) {
    const [user, setUser] = useState(props.data);
    const allSelected = props.allMember.length === user.length;

    useEffect(() => {
        setUser(props.data);
    }, [props.data]);

    const handleAddMember = (newValue) => {
        props.onAddPlayer(newValue);
    };
    const filter = createFilterOptions();

    const handleChange = (event, user, reason) => {
        // console.log(user, reason);
        if (reason === 'selectOption' || reason === 'removeOption') {
            if (user.find((option) => option.value === 'select-all')) {
                handleToggleSelectAll();
                let result = [];
                result = props.allMember.filter((el) => el.value !== 'select-all');
                // console.log('data 1', !allSelected ? result : []);
                return handleAddMember(!allSelected ? result : []);
            } else {
                handleToggleOption && handleToggleOption(user);
                // console.log('data 2', user);
                return handleAddMember(user);
            }
        } else if (reason === 'clear') {
            handleClearOptions && handleClearOptions();
            return handleAddMember(user);
        }
    };

    const handleToggleSelectAll = () => {
        console.log(!allSelected);
        handleSelectAll && handleSelectAll(!allSelected);
    };

    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            setUser(props.allMember);
        } else {
            handleClearOptions && handleClearOptions();
        }
    };

    const handleClearOptions = () => setUser([]);
    const handleToggleOption = (user) => setUser(user);

    return (
        <Autocomplete
            // key={props.data.length > 0}
            size="medium"
            multiple
            id="checkboxes-tags-demo"
            options={props.allMember}
            value={user}
            isOptionEqualToValue={(option, value) => option.studentId === value.studentId}
            // onChange={(event, newValue) => {
            //     setUser(newValue);
            //     handleAddMember(newValue);
            // }}
            onChange={handleChange}
            // getOptionDisabled={(options) => (user.length >= 1 ? true : false)}
            noOptionsText="Nhập MSSV để thêm"
            disableCloseOnSelect
            getOptionLabel={(option) => option.studentId}
            renderOption={(props, option, { selected }) => {
                const selectAllProps =
                    option.value === 'select-all' // To control the state of 'select-all' checkbox
                        ? { checked: allSelected }
                        : {};
                return (
                    <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                            {...selectAllProps}
                        />
                        {option.studentId} - {option.name}
                    </li>
                );
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                return [{ studentId: 'Chọn tất cả', name: 'All', value: 'select-all' }, ...filtered];
            }}
            style={{ width: '80%' }}
            renderInput={(params) => (
                <TextField {...params} label="Danh sách vận động viên" placeholder="Thêm vận động  viên" />
            )}
        />
    );
}

export default AddMember;
