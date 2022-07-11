import React, { useState } from 'react';
import { FormControl, MenuItem, Select } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const roles = [
    { roleId: 1, roleName: 'Thành viên tham gia' },
    { roleId: 2, roleName: 'Thành viên ban truyền thông' },
    { roleId: 3, roleName: 'Thành viên ban văn hóa' },
    { roleId: 4, roleName: 'Thành viên ban hậu cần' },
];

const getRoleNameByid = (roleId) => {
    return roles.find((role) => role.roleId === roleId).roleName;
};

function RenderSelectEditCell(props) {
    const { id, value, api, field } = props;
    const [idRole, setIdRole] = useState(props.row.roleId);
    console.log(props);
    const classes = useStyles();

    const handleChange = React.useCallback(
        (event) => {
            const editProps = {
                value: Number(event.target.value),
            };
            console.log(event.target.value);
            setIdRole(event.target.value);
            api.commitCellChange({ id, field, props: editProps });
            api.setCellMode(id, field, 'view');
            event.stopPropagation();
        },
        [api, field, id],
    );

    return (
        <FormControl className={classes.formControl}>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={value} onChange={handleChange}>
                {/* {roles.map((role, index) => (
                    <MenuItem value={role.roleId} key={index}>
                        {role.roleName}
                    </MenuItem>
                ))} */}
                <MenuItem value={1}>Thành viên tham gia</MenuItem>
                <MenuItem value={2}>Thành viên ban truyền thông</MenuItem>
                <MenuItem value={3}>Thành viên ban hậu cần</MenuItem>
                <MenuItem value={4}>Thành viên ban văn hóa</MenuItem>
            </Select>
        </FormControl>
    );
}

export function renderSelectEditCell(params) {
    return <RenderSelectEditCell {...params} />;
}
