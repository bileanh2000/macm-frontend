import { Add, CheckBox, CheckBoxOutlineBlank, Delete } from '@mui/icons-material';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Collapse,
    Fab,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import userApi from 'src/api/userApi';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

function AddMember(props) {
    console.log(props);
    const [datas, setDatas] = useState(props.data);
    const [isChecked, setIsChecked] = useState(false);
    const [user, setUser] = useState([]);
    // const [allMember, setAllMember] = useState();

    // const getAllMember = async () => {
    //     try {
    //         const response = userApi.getAllMember();
    //         setAllMember(response.data);
    //     } catch (error) {
    //         console.log('khong the lay data');
    //     }
    // };

    // useEffect(() => {
    //     getAllMember();
    // }, []);

    const handleAddMember = () => {
        // const newInput = { ...data, id: Math.random() };
        const newData = [...datas, user];
        setDatas(newData);
        console.log(newData);
        // if (props.gender == 0) {
        //     props.onAddMale(newData);
        // } else {
        //     props.onAddFemale(newData);
        // }
        setIsChecked(!isChecked);
        // reset({
        //     name: '',
        //     studentId: '',
        // });
    };

    const handleCancel = () => {
        setIsChecked(!isChecked);
        // reset({
        //     name: '',
        //     studentId: '',
        // });
    };

    const handleDelete = (id) => {
        const newData = datas.filter((data) => {
            return data.studentId !== id;
        });
        setDatas(newData);
        props.onAddPerformanceCompetition(newData);
    };

    return (
        <Box>
            <Paper elevation={3} sx={{ width: '100%' }}>
                {props.data.length > 0 && (
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Mã sinh viên</TableCell>
                                    <TableCell align="center">Tên</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {datas.map((data) => (
                                    <TableRow key={data.studentId}>
                                        <TableCell align="center">{data.studentId}</TableCell>
                                        <TableCell align="center">{data.name}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => {
                                                    // handleOpenDialog();
                                                    handleDelete(data.studentId);
                                                }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
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
                                    setUser(newValue);
                                }}
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
                                style={{ width: 500 }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Thành viên" placeholder="Thêm thành viên" />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} container spacing={2}>
                            {/* <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    label="Mã sinh viên"
                                    variant="outlined"
                                    {...register('studentId')}
                                    error={errors.studentId ? true : false}
                                    helperText={errors.studentId?.message}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="outlined-error-helper-text fullWidth"
                                    label="Tên thành viên"
                                    {...register('name')}
                                    error={errors.name ? true : false}
                                    defaultValue=""
                                    helperText={errors.name?.message}
                                    required
                                    fullWidth
                                />
                            </Grid> */}
                        </Grid>
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
            {(props.gender == 0 && props.numberMale == 0) || (props.gender == 1 && props.numberFemale == 0) ? (
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
