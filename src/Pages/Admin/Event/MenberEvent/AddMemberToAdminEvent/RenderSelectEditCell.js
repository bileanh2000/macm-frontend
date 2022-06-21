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
    { roleId: 11, roleName: 'Thành viên ban truyền thông' },
    { roleId: 22, roleName: 'Thành viên ban văn hóa' },
    { roleId: 33, roleName: 'Thành viên ban hậu cần' },
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
            api.commitCellChange({ id, field, props: editProps });
            api.setCellMode(id, field, 'view');
            event.stopPropagation();
        },
        [api, field, id],
    );

    return (
        <FormControl className={classes.formControl}>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={props.row.id}
                onChange={handleChange}
            >
                {/* {roles.map((role, index) => (
                    <MenuItem value={role.roleId} key={index}>
                        {role.roleName}
                    </MenuItem>
                ))} */}
                <MenuItem value={1}>Ban Van Hoa</MenuItem>
                <MenuItem value={2}>Ban Truyen Thong</MenuItem>
                <MenuItem value={3}>Ban Hau Can</MenuItem>
            </Select>
        </FormControl>
    );
}

export function renderSelectEditCell(params) {
    return <RenderSelectEditCell {...params} />;
}
