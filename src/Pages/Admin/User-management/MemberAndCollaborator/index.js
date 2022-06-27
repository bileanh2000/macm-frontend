import { Fragment, useEffect, useState, useCallback, useMemo } from 'react';
import userApi from 'src/api/userApi';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
    GridToolbar,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    useGridApiContext,
    useGridSelector,
    gridPageSelector,
    gridPageCountSelector,
    gridPageSizeSelector,
} from '@mui/x-data-grid';
import {
    Alert,
    Box,
    Button,
    ClickAwayListener,
    Fade,
    FormControlLabel,
    Grid,
    Grow,
    MenuItem,
    Pagination,
    Snackbar,
    styled,
    TablePagination,
    Tooltip,
} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useNavigate } from 'react-router-dom';
import { Link as routerLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from '@mui/material/Typography';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import styles from './MemberAndCollaborator.module.scss';
import { FileUploader } from 'react-drag-drop-files';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import clsx from 'clsx';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import moment from 'moment';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';

const fileTypes = ['CSV', 'JPG', 'png'];
const Input = styled('input')({
    display: 'none',
});

function MemberAndCollaborator() {
    let navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [openUploadFile, setOpenUploadFile] = useState(false);
    const [semester, setSemester] = useState('Summer2022');
    const [editable, setEditable] = useState(false);
    const [checked, setChecked] = useState(false);
    const [gender, setGender] = useState('');
    const [userData, setUserData] = useState([]);

    const onChangeSearch = {
        dateFrom: '',
        dateTo: '',
        email: '',
        gender: '',
        generation: '',
        isActive: '',
        name: '',
        roleId: '',
        studentId: '',
    };

    const callApi = (val, fieldBy) => {
        onChangeSearch[fieldBy] = val;
        console.log('callApi', onChangeSearch);
    };

    const handleChangeGender = (event) => {
        setGender(event.target.value);
    };
    const toggleFilter = () => {
        setChecked((prev) => !prev);
    };

    const handleClickOpen = () => {
        setOpenUploadFile(true);
    };
    const handleClickAway = () => {
        setChecked(false);
    };

    const handleClose = () => {
        setOpenUploadFile(false);
    };

    const fetchUserListBySemester = async (params) => {
        try {
            const response = await userApi.getAllUserBySemester(params);
            console.log(response);
            setUserList(response.data);
            setUserData(response.data);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };
    const handleChange = (event) => {
        console.log(event.target.value);
        setSemester(event.target.value);
        if (event.target.value != 'Summer2022') {
            setEditable(true);
        } else {
            setEditable(false);
        }
        console.log(editable);
        fetchUserListBySemester(semester);
    };

    useEffect(() => {
        // fetchUserList();
        fetchUserListBySemester(semester);
    }, [semester]);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        // resolver: yupResolver(validationSchema),
        // mode: 'onBlur',
    });
    const handleUpdateStatus = (id) => {
        console.log(id);
        const params = { semester: semester, studentId: id };
        userApi.updateUserStatus(params).then((res) => {
            setUserList((oldUserList) => {
                return oldUserList.map((user) => {
                    if (user.studentId === id) {
                        console.log(user.studentId, id);
                        return { ...user, active: !user.active };
                    }
                    return user;
                });
            });
            console.log('1', res);
            console.log('2', res.data);
        });
    };
    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5, hide: true },
        { field: 'name', headerName: 'Tên', flex: 0.8 },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
            renderCell: (params) => <Link href={`mailto:${params.value}`}>{params.value.toString()}</Link>,
            flex: 1,
        },

        { field: 'gender', headerName: 'Giới tính', flex: 0.5 },
        { field: 'dateOfBirth', headerName: 'Ngày sinh', flex: 0.5 },
        { field: 'month', headerName: 'Tháng sinh', flex: 0.5, hide: true, hideable: false },
        { field: 'generation', headerName: 'Gen', flex: 0.5 },
        { field: 'studentId', headerName: 'Mã sinh viên', flex: 0.6 },
        { field: 'role', headerName: 'Vai trò', flex: 1.2 },
        {
            field: 'active',
            headerName: 'Trạng thái',
            renderCell: (cellValues) => {
                return (
                    <Button
                        sx={{
                            // borderRadius: '5px',
                            ...(cellValues.row.active === 'Active'
                                ? {
                                      backgroundColor: '#00AD31',
                                      boxShadow: 'none',
                                      '&:hover': {
                                          backgroundColor: '#008a27',
                                          boxShadow: 'none',
                                      },
                                      '&:active': {
                                          boxShadow: 'none',
                                          backgroundColor: '#008a27',
                                      },
                                  }
                                : {
                                      backgroundColor: '#ff3838',
                                      boxShadow: 'none',
                                      '&:hover': {
                                          backgroundColor: '#e53232',
                                          boxShadow: 'none',
                                      },
                                      '&:active': {
                                          boxShadow: 'none',
                                          backgroundColor: '#e53232',
                                      },
                                  }),
                        }}
                        variant="contained"
                        color="primary"
                        onClick={(event) => {
                            handleUpdateStatus(cellValues.row.studentId);
                        }}
                        // onClick={(event) => {
                        //     toggleStatus(cellValues.row.studentId);
                        // }}
                    >
                        {cellValues.row.active}
                    </Button>
                );
            },
        },
        {
            hideable: !editable,
            hide: editable,
            field: 'actions',
            type: 'actions',
            flex: 0.5,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />} label="Chỉnh sửa" onClick={editUser(params.row.studentId)} />,
            ],
        },
    ];
    const countActive = userList.filter((item) => {
        return item.active === true;
    }).length;

    const rowsUser = userList.map((item, index) => {
        const container = {};
        container['id'] = index + 1;
        container['name'] = item.name;
        container['email'] = item.email;
        container['gender'] = item.gender ? 'Nam' : 'Nữ';
        container['dateOfBirth'] = moment(new Date(item.dateOfBirth)).format('DD/MM/yyyy');
        container['generation'] = item.generation;
        container['month'] = new Date(item.dateOfBirth).getMonth() + 1;
        container['studentId'] = item.studentId;
        container['role'] = item.roleName;
        container['active'] = item.active ? 'Active' : 'Deactive';

        return container;
    });

    const editUser = useCallback(
        (studentId) => () => {
            setTimeout(() => {
                // setRows((prevRows) => prevRows.filter((row) => row.id !== id));
                console.log(studentId);
                let path = `${studentId}/edit`;
                navigate(path);
            });
        },
        [],
    );

    const handleOnClick = (rowData) => {
        console.log('push -> /roles/' + rowData.studentId);
        let path = `${rowData.studentId}`;
        navigate(path);
        // alert('navigation');
    };
    const [openSnackBar, setOpenSnackBar] = useState(false);
    let snackBarStatus;
    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };
    const onSubmit = (data) => {
        let formData = new FormData();
        formData.append('file', data.file[0]);
        axios
            .post('https://capstone-project-macm.herokuapp.com/api/admin/hr/users/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => {
                console.log(res);
                if (res.data.length != 0) {
                    setOpenSnackBar(true);
                    // setSnackBarStatus(true);
                    snackBarStatus = true;
                    dynamicAlert(snackBarStatus, res.data.message);
                } else {
                    console.log('huhu');
                    setOpenSnackBar(true);
                    // setSnackBarStatus(false);
                    snackBarStatus = false;
                    dynamicAlert(snackBarStatus, res.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const filterSubmit = (data) => {
        console.log(data);
        const dataFormat = {
            dateFrom: data.startDate === null ? '' : moment(new Date(data.startDate)).format('yyyy-MM-DD'),
            dateTo: data.endDate === null ? '' : moment(new Date(data.endDate)).format('yyyy-MM-DD'),
            // email: data.email,
            gender: data.gender,
            generation: data.generation,
            isActive: data.isActive,
            // name: data.name,
            roleId: data.roleId,
            // studentId: data.studentId,
        };

        userApi
            .searchByMultipleField(dataFormat, userData && userData)
            .then((res) => {
                console.log('filter', res);
                console.log('filter data', res.data);
                setUserList(res.data);
                toggleFilter();
            })
            .catch((error) => {
                console.log('failed when filter', error.response);
            });
        console.log(dataFormat);
    };

    const exportExcel = () => {
        console.log('exportExcel');
        axios({
            url: 'https://capstone-project-macm.herokuapp.com/api/admin/hr/users/export', //your url
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'hahahaahahah.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    };

    function CustomToolbar() {
        return (
            <Fragment>
                <GridToolbarContainer>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <GridToolbarColumnsButton /> */}
                        <Button startIcon={<FilterListIcon />} size="small" onClick={toggleFilter} sx={{ mr: 1 }}>
                            BỘ LỌC
                        </Button>
                        <GridToolbarQuickFilter />
                        <Box>
                            <Grow in={checked}>
                                <Box
                                    component="form"
                                    onSubmit={handleSubmit(filterSubmit)}
                                    sx={{
                                        position: 'absolute',
                                        zIndex: '2',
                                        top: '90px',
                                        backgroundColor: 'white',
                                        padding: '10px 20px 30px 20px',
                                        boxShadow: 5,
                                        borderRadius: '3px',
                                        maxWidth: '450px',
                                        '& .MuiTextField-root': { mb: 2 },
                                    }}
                                >
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            {/* <TextField
                                    fullWidth
                                    id="standard-basic"
                                    label="Tên"
                                    variant="standard"
                                    size="small"
                                    onChange={(e) => {
                                        onChangeSearch.name = e.target.value;
                                        // console.log(onChangeSearch);
                                    }}
                                    // {...register('name')}
                                /> */}
                                            {/* <TextField
                                    fullWidth
                                    id="standard-basic"
                                    label="Mã sinh viên"
                                    variant="standard"
                                    size="small"
                                    // {...register('studentId')}
                                    onChange={(e) => {
                                        onChangeSearch.studentId = e.target.value;
                                        // console.log(onChangeSearch);
                                    }}
                                /> */}
                                            <TextField
                                                fullWidth
                                                id="standard-select-currency"
                                                select
                                                label="Gen"
                                                // onChange={handleChangeGender}
                                                defaultValue=""
                                                variant="standard"
                                                size="small"
                                                {...register('generation')}
                                                // onChange={(e) => {
                                                //     onChangeSearch.generation = e.target.value;
                                                //     // console.log(onChangeSearch);
                                                // }}
                                            >
                                                <MenuItem value="">Tất cả</MenuItem>
                                                <MenuItem value="1">1</MenuItem>
                                                <MenuItem value="2">2</MenuItem>
                                                <MenuItem value="3">3</MenuItem>
                                                <MenuItem value="4">4</MenuItem>
                                                <MenuItem value="5">5</MenuItem>
                                            </TextField>

                                            <TextField
                                                fullWidth
                                                id="standard-select-currency"
                                                select
                                                label="Trạng thái"
                                                // onChange={handleChangeGender}
                                                defaultValue=""
                                                variant="standard"
                                                size="small"
                                                {...register('isActive')}
                                                // onChange={(e) => {
                                                //     onChangeSearch.isActive = e.target.value;
                                                //     // console.log(onChangeSearch);
                                                // }}
                                            >
                                                <MenuItem value="">Tất cả</MenuItem>
                                                <MenuItem value="true">Active</MenuItem>
                                                <MenuItem value="false">Deactive</MenuItem>
                                            </TextField>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                                <Controller
                                                    name="startDate"
                                                    control={control}
                                                    defaultValue={null}
                                                    render={({
                                                        field: { onChange, value },
                                                        fieldState: { error, invalid },
                                                    }) => (
                                                        <DatePicker
                                                            label="Từ ngày"
                                                            // views={['year', 'month', 'day']}
                                                            disableFuture
                                                            // maxDate={new Date('2022-06-12')}
                                                            views={['year', 'month', 'day']}
                                                            ampm={false}
                                                            value={value}
                                                            // onChange={(value) => callApi(value, 'dateFrom')}
                                                            onChange={(value) => {
                                                                onChange(value);
                                                                // onChangeSearch.dateFrom =
                                                                //     value === null ? '' : moment(value).format('yyyy-MM-DD');
                                                                // console.log(onChangeSearch);
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    id="outlined-disabled"
                                                                    error={invalid}
                                                                    helperText={invalid ? error.message : null}
                                                                    // id="startDate"
                                                                    variant="standard"
                                                                    margin="dense"
                                                                    fullWidth
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={6}>
                                            {/* <TextField
                                    fullWidth
                                    id="standard-basic"
                                    label="Email"
                                    variant="standard"
                                    size="small"
                                    // {...register('email')}
                                    onChange={(e) => {
                                        onChangeSearch.email = e.target.value;
                                        // console.log(onChangeSearch);
                                    }}
                                /> */}
                                            <TextField
                                                fullWidth
                                                id="standard-select-currency"
                                                select
                                                label="Giới tính"
                                                // onChange={handleChangeGender}
                                                defaultValue=""
                                                variant="standard"
                                                size="small"
                                                {...register('gender')}
                                                // onChange={(e) => {
                                                //     onChangeSearch.gender = e.target.value;
                                                //     // console.log(onChangeSearch);
                                                // }}
                                            >
                                                <MenuItem value="">Tất cả</MenuItem>
                                                <MenuItem value="true">Nam</MenuItem>
                                                <MenuItem value="false">Nữ</MenuItem>
                                            </TextField>
                                            <TextField
                                                fullWidth
                                                id="standard-select-currency"
                                                select
                                                label="Vai trò"
                                                // onChange={handleChangeGender}
                                                defaultValue=""
                                                variant="standard"
                                                size="small"
                                                {...register('roleId')}
                                                // onChange={(e) => {
                                                //     onChangeSearch.roleId = e.target.value;
                                                //     // console.log(onChangeSearch);
                                                // }}
                                            >
                                                <MenuItem value="">Tất cả</MenuItem>
                                                <MenuItem value={10}>Ban truyền thông</MenuItem>
                                                <MenuItem value={11}>Ban văn hóa</MenuItem>
                                                <MenuItem value={12}>Ban chuyên môn</MenuItem>
                                                <MenuItem value={13}>CTV Ban truyền thông</MenuItem>
                                                <MenuItem value={14}>CTV Ban văn hóa</MenuItem>
                                                <MenuItem value={15}>CTV Ban chuyên môn</MenuItem>
                                            </TextField>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                                <Controller
                                                    name="endDate"
                                                    control={control}
                                                    defaultValue={null}
                                                    render={({
                                                        field: { onChange, value },
                                                        fieldState: { error, invalid },
                                                    }) => (
                                                        <DatePicker
                                                            label="Đến ngày"
                                                            // views={['year', 'month', 'day']}
                                                            disableFuture
                                                            // maxDate={new Date('2022-06-12')}
                                                            views={['year', 'month', 'day']}
                                                            ampm={false}
                                                            value={value}
                                                            onChange={(value) => {
                                                                onChange(value);
                                                                // onChangeSearch.dateTo =
                                                                //     value === null ? '' : moment(value).format('yyyy-MM-DD');
                                                                // console.log(onChangeSearch);
                                                            }}
                                                            // onChange={(value) => callApi(value, 'dateTo')}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    id="outlined-disabled"
                                                                    error={invalid}
                                                                    helperText={invalid ? error.message : null}
                                                                    // id="startDate"
                                                                    variant="standard"
                                                                    margin="dense"
                                                                    fullWidth
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                            <Box
                                                sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}
                                            >
                                                <Button variant="contained" type="submit">
                                                    Lọc
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grow>
                        </Box>
                    </Box>

                    <Typography variant="button" color="initial" sx={{ marginLeft: 'auto', marginRight: '1rem' }}>
                        Tổng thành viên Active: {countActive}/{userList.length}
                    </Typography>
                </GridToolbarContainer>
                {/* <ClickAwayListener onClickAway={handleClickAway}> */}

                {/* </ClickAwayListener> */}
                {/* <Box>
                </Box> */}
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={5000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={handleCloseSnackBar}
                    variant="filled"
                    severity={customAlert.severity || 'success'}
                    sx={{ width: '100%' }}
                >
                    {customAlert.message}
                </Alert>
            </Snackbar>
            <Dialog open={openUploadFile} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle>Tải lên file Excel</DialogTitle>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="outlined" component="span" sx={{ mr: 1 }} onClick={exportExcel}>
                            Tải File mẫu
                        </Button>
                        <input type="file" accept=".xlsx" {...register('file')} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Từ chối</Button>
                        <Button type="submit">Đồng ý</Button>
                    </DialogActions>
                </Box>
            </Dialog>
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 4 }}>
                Quản lý Thành viên và Cộng tác viên
            </Typography>
            <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <TextField
                        id="outlined-select-currency"
                        size="small"
                        select
                        label="Chọn kỳ"
                        value={semester}
                        onChange={handleChange}
                    >
                        {/* {currencies.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))} */}
                        <MenuItem value="Summer2022">Summer 2022</MenuItem>
                        <MenuItem value="Spring2022">Spring 2022</MenuItem>
                    </TextField>
                </Box>
                <Box>
                    <Button
                        variant="outlined"
                        sx={{ marginRight: 2 }}
                        component={routerLink}
                        to={'/admin/addUser'}
                        startIcon={<AddCircleIcon />}
                    >
                        Thêm thành viên
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ marginRight: 2 }}
                        startIcon={<UploadFileIcon />}
                        onClick={handleClickOpen}
                    >
                        Thêm danh sách thành viên
                    </Button>
                    <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} onClick={exportExcel}>
                        Xuất File Excel
                    </Button>
                </Box>
            </Box>
            {/* <div style={{ height: '70vh', width: '100%' }}> */}
            <Box
                sx={{
                    height: '70vh',
                    width: '100%',
                }}
            >
                <DataGrid
                    // loading={!userList.length}
                    disableSelectionOnClick={true}
                    rows={rowsUser}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 20, 30]}
                    onCellDoubleClick={(param) => {
                        handleOnClick(param.row);
                    }}
                    localeText={{
                        toolbarColumns: 'Cột',
                        toolbarFilters: 'Bộ lọc tìm kiếm',
                    }}
                    components={{
                        Toolbar: CustomToolbar,
                        // Pagination: CustomPagination,
                    }}
                />
            </Box>
            {/* </div> */}
        </Fragment>
    );
}

export default MemberAndCollaborator;
