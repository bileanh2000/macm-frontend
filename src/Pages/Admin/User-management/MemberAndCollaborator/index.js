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
    GridFooterContainer,
    GridFooter,
    GridLinkOperator,
} from '@mui/x-data-grid';
import {
    Alert,
    Autocomplete,
    Badge,
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
import DialogTitle from '@mui/material/DialogTitle';

import { Controller, useForm } from 'react-hook-form';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import moment from 'moment';
import FilterListIcon from '@mui/icons-material/FilterList';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import AddMemberDialog from '../AddMemberDialog';
import ViewDetailMemberDialog from '../ViewDetailMemberDialog';
import { createMuiTheme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

const months = [
    { name: 'Tháng 1', value: 1 },
    { name: 'Tháng 2', value: 2 },
    { name: 'Tháng 3', value: 3 },
    { name: 'Tháng 4', value: 4 },
    { name: 'Tháng 5', value: 5 },
    { name: 'Tháng 6', value: 6 },
    { name: 'Tháng 7', value: 7 },
    { name: 'Tháng 8', value: 8 },
    { name: 'Tháng 9', value: 9 },
    { name: 'Tháng 10', value: 10 },
    { name: 'Tháng 11', value: 11 },
    { name: 'Tháng 12', value: 12 },
];
function MemberAndCollaborator() {
    const token = localStorage[`accessToken`];
    let navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [pageSize, setPageSize] = useState(30);
    const [openUploadFile, setOpenUploadFile] = useState(false);
    const [semester, setSemester] = useState('Summer2022');
    const [editable, setEditable] = useState(false);
    const [checked, setChecked] = useState(false);
    const [userData, setUserData] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [emailList, setEmailList] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState([]);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [isOpenAddMember, setIsOpenAddMember] = useState(false);
    const [isOpenViewMember, setIsOpenViewMember] = useState(false);
    const [isEditDialog, setIsEditDialog] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [errorList, setErrorList] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [listMonth, setListMonth] = useState([]);
    const [listGen, setListGen] = useState([]);
    const [generation, setGeneration] = useState(-1);
    const [gender, setGender] = useState(-1);
    const [status, setStatus] = useState(-1);
    const [isActive, setIsActive] = useState(-1);
    const [roleId, setRoleId] = useState(-1);
    const [filterCount, setFilterCount] = useState(0);
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const styles = (theme) => ({
        disabledButton: {
            backgroundColor: theme.palette.primary || 'red',
        },
    });

    const getAllGen = async () => {
        try {
            const response = await userApi.getAllGen();
            console.log('getAllGen', response.data);
            setListGen(response.data);
        } catch (error) {
            console.log('failed when getAllGen');
        }
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
        // fetchUserListBySemester(semester);
    };

    useEffect(() => {
        // fetchUserList();
        fetchUserListBySemester(semester);
        setIsUpdate(false);
        getAllGen();
    }, [semester, isUpdate]);

    useEffect(() => {
        let emails = selectedRows.map((item) => item.email);
        console.info('email', emails);
        setEmailList(emails);
    }, [selectedRows]);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        // resolver: yupResolver(validationSchema),
        // mode: 'onBlur',
    });
    const handleUpdateStatus = (id, name) => {
        console.log(id, name);
        const params = { semester: semester, studentId: id };
        userApi.updateUserStatus(params).then((res) => {
            let status = res.data[0].active === false ? 'Deactive' : 'Active';
            enqueueSnackbar(`Cập nhật trạng thái cho ${id} - ${name} thành công: ${status}`, { variant: 'success' });
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
            // renderCell: (params) => <Link href={`mailto:${params.value}`}>{params.value.toString()}</Link>,
            flex: 1,
        },

        { field: 'gender', headerName: 'Giới tính', flex: 0.5 },
        { field: 'dateOfBirth', headerName: 'Ngày sinh', flex: 0.5 },
        { field: 'month', headerName: 'Tháng sinh', flex: 0.5, hide: true, hideable: false },
        { field: 'generation', headerName: 'Gen', flex: 0.5 },
        { field: 'studentId', headerName: 'Mã sinh viên', flex: 0.6 },
        { field: 'roleName', headerName: 'Vai trò', flex: 1.2 },
        {
            field: 'active',
            headerName: 'Trạng thái',
            renderCell: (cellValues) => {
                return (
                    <Button
                        sx={{
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
                            handleUpdateStatus(cellValues.row.studentId, cellValues.row.name);
                        }}
                        // onClick={(event) => {
                        //     toggleStatus(cellValues.row.studentId);
                        // }}
                        disabled={user.role.name !== 'ROLE_HeadClub' && user.role.name !== 'ROLE_ViceHeadClub'}
                        // classes={{ disabled: classes.disabledButton }}
                    >
                        {cellValues.row.active}
                    </Button>
                );
            },
        },
        {
            hideable: !editable,
            ...(user.role.name === 'ROLE_HeadClub' || user.role.name === 'ROLE_ViceHeadClub'
                ? { hide: editable }
                : { hide: true }),

            field: 'actions',
            type: 'actions',
            flex: 0.5,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />} label="Chỉnh sửa" onClick={() => editUser(params)} />,
            ],
        },
    ];
    const countActive = userList.filter((item) => {
        return item.active === true;
    }).length;

    const rowsUser = userList.map((item, index) => {
        const container = {};
        container['id'] = item.id;
        container['name'] = item.name;
        container['email'] = item.email;
        container['gender'] = item.gender ? 'Nam' : 'Nữ';
        container['dateOfBirth'] = moment(new Date(item.dateOfBirth)).format('DD/MM/yyyy');
        container['generation'] = item.generation;
        container['month'] = new Date(item.dateOfBirth).getMonth() + 1;
        container['studentId'] = item.studentId;
        container['roleName'] = item.roleName;
        container['active'] = item.active ? 'Active' : 'Deactive';
        container['phone'] = item.phone;
        container['image'] = item.image;
        container['currentAddress'] = item.currentAddress;
        container['roleId'] = item.roleId;

        return container;
    });

    const editUser = (params) => {
        setSelectedStudent(params.row);
        setIsOpenViewMember(true);
        setIsEditDialog(true);
    };

    const handleOnClick = (rowData) => {
        // console.log('push -> /roles/' + rowData.studentId);
        setSelectedStudent(rowData);
        setIsOpenViewMember(true);
        setIsEditDialog(false);
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
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log(res.data.message);
                if (res.data.data.length) {
                    enqueueSnackbar(res.data.message, { variant: 'warning' });
                    setErrorList(res.data.data);
                } else {
                    enqueueSnackbar(res.data.message, { variant: 'success' });
                    setIsUpdate(true);
                    setErrorList([]);
                    handleClose();
                }
                // if (res.data.length !== 0) {
                //     // enqueueSnackbar(res.data.message, { variant: 'success' });
                //     setErrorList(res.data.data);
                // } else {
                //     console.log('huhu');
                //     setOpenSnackBar(true);
                //     // setSnackBarStatus(false);
                //     snackBarStatus = false;
                //     dynamicAlert(snackBarStatus, res.data.message);
                // }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const filterSubmit = (data) => {
        console.log(data);
        const dataFormat = {
            // dateFrom: data.startDate === null ? '' : moment(new Date(data.startDate)).format('yyyy-MM-DD'),
            // dateTo: data.endDate === null ? '' : moment(new Date(data.endDate)).format('yyyy-MM-DD'),
            gender: gender === -1 ? '' : gender,
            generation: generation === -1 ? '' : generation,
            isActive: isActive === -1 ? '' : isActive,
            roleId: roleId === -1 ? '' : roleId,
            month: listMonth.map((i) => i.value),
        };
        let count = Object.values(dataFormat).filter((i) => i.length != [].length && i !== '').length;
        setFilterCount(count);
        userApi
            .searchByMultipleField(dataFormat, userData && userData)
            .then((res) => {
                console.log('filter', res);
                console.log('filter data', res.data);
                setUserList(res.data);
                toggleFilter();
            })
            .catch((error) => {
                console.error('failed when filter', error.response);
            });
        console.log(dataFormat);
    };

    useEffect(() => {
        console.log(listMonth);
    }, [listMonth]);
    const searchJson = (searchTerm) => {
        rowsUser
            .filter((val) => {
                if (searchTerm == '') {
                    return val;
                } else if (
                    val.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    val.studentId.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                    return val;
                }
            })
            .map((val, key) => {
                console.log('3', val);
                setSearchResult(val);
                return <div>{val.first_name} </div>;
            });
    };

    const exportExcel = () => {
        axios({
            url: 'https://capstone-project-macm.herokuapp.com/api/admin/hr/users/export', //your url
            method: 'POST',
            ...(selectedRows.length > 0 ? { data: selectedRows } : { data: userList }),
            // data: selectedRows,

            responseType: 'blob', // important
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'MACM - Danh sách thành viên.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    };

    const exportErrorList = () => {
        axios({
            url: 'https://capstone-project-macm.herokuapp.com/api/admin/hr/users/exporterror', //your url
            method: 'POST',

            data: errorList,

            responseType: 'blob', // important
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'MACM - Danh sách thành viên thêm lỗi.xlsx'); //or any other extension
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
    const CustomFooter = () => {
        return (
            <GridFooterContainer>
                {/* <a href="http://">Gửi email cho ({selectedRows.length}) người đã chọn</a> */}
                <a href={`mailto:` + emailList.toString()} style={{ marginLeft: '10px' }}>
                    {selectedRows.length > 0 ? `Gửi email cho (${selectedRows.length}) người đã chọn` : ''}
                </a>
                <GridFooter
                    sx={{
                        border: 'none', // To delete double border.
                    }}
                />
            </GridFooterContainer>
        );
    };

    return (
        <Fragment>
            {isOpenAddMember && (
                <AddMemberDialog
                    title="Thêm thành viên"
                    isOpen={isOpenAddMember}
                    handleClose={() => setIsOpenAddMember(false)}
                    onSucess={(newUser) => {
                        setUserList([newUser, ...userList]);
                    }}
                />
            )}
            {isOpenViewMember && (
                <ViewDetailMemberDialog
                    // title="Thông tin thành viên"
                    selectedStudent={selectedStudent}
                    isOpen={isOpenViewMember}
                    handleClose={() => setIsOpenViewMember(false)}
                    editable={isEditDialog}
                    onSucess={(updatedUser) => {
                        setUserList((oldUserList) => {
                            return oldUserList.map((user) => {
                                if (user.id === updatedUser.id) {
                                    return {
                                        ...user,
                                        name: updatedUser.name,
                                        email: updatedUser.email,
                                        gender: updatedUser.gender,
                                        dateOfBirth: updatedUser.dateOfBirth,
                                        generation: updatedUser.generation,
                                        studentId: updatedUser.studentId,
                                        roleName: updatedUser.roleName,
                                        phone: updatedUser.phone,
                                        currentAddress: updatedUser.currentAddress,
                                        roleId: updatedUser.roleId,
                                    };
                                }
                                return user;
                            });
                        });
                        setIsUpdate(true);
                    }}
                />
            )}
            {/* Filter */}
            <Grow in={checked}>
                <Box
                    component="form"
                    onSubmit={handleSubmit(filterSubmit)}
                    sx={{
                        position: 'absolute',
                        top: '322px',
                        right: '103px',
                        zIndex: '2',
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
                            <TextField
                                id="outlined-select-currency"
                                fullWidth
                                select
                                variant="standard"
                                size="small"
                                label="Gen"
                                value={generation}
                                onChange={(event) => setGeneration(event.target.value)}
                            >
                                <MenuItem value={-1}>Tất cả</MenuItem>
                                {listGen.map((i) => {
                                    return (
                                        <MenuItem key={i} value={i}>
                                            {i}
                                        </MenuItem>
                                    );
                                })}
                            </TextField>

                            <TextField
                                id="outlined-select-currency"
                                fullWidth
                                select
                                variant="standard"
                                size="small"
                                label="Trạng thái"
                                value={isActive}
                                onChange={(event) => setIsActive(event.target.value)}
                            >
                                <MenuItem value={-1}>Tất cả</MenuItem>
                                <MenuItem value="true">Active</MenuItem>
                                <MenuItem value="false">Deactive</MenuItem>
                            </TextField>
                            {/* <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                <Controller
                                    name="startDate"
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
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
                            </LocalizationProvider> */}
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="outlined-select-currency"
                                fullWidth
                                select
                                variant="standard"
                                size="small"
                                label="Giới tính"
                                value={gender}
                                onChange={(event) => setGender(event.target.value)}
                            >
                                <MenuItem value={-1}>Tất cả</MenuItem>
                                <MenuItem value="true">Nam</MenuItem>
                                <MenuItem value="false">Nữ</MenuItem>
                            </TextField>

                            <TextField
                                id="outlined-select-currency"
                                fullWidth
                                select
                                variant="standard"
                                size="small"
                                label="Vai trò"
                                value={roleId}
                                onChange={(event) => setRoleId(event.target.value)}
                            >
                                <MenuItem value={-1}>Tất cả</MenuItem>
                                <MenuItem value={10}>Ban truyền thông</MenuItem>
                                <MenuItem value={11}>Ban văn hóa</MenuItem>
                                <MenuItem value={12}>Ban chuyên môn</MenuItem>
                                <MenuItem value={13}>CTV Ban truyền thông</MenuItem>
                                <MenuItem value={14}>CTV Ban văn hóa</MenuItem>
                                <MenuItem value={15}>CTV Ban chuyên môn</MenuItem>
                            </TextField>
                            {/* <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                <Controller
                                    name="endDate"
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                        <DatePicker
                                            label="Đến ngày"
                                            disableFuture
                                            views={['year', 'month', 'day']}
                                            ampm={false}
                                            value={value}
                                            onChange={(value) => {
                                                onChange(value);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    id="outlined-disabled"
                                                    error={invalid}
                                                    helperText={invalid ? error.message : null}
                                                    variant="standard"
                                                    margin="dense"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </LocalizationProvider> */}
                        </Grid>
                    </Grid>
                    <Autocomplete
                        multiple
                        id="tags-outlined"
                        value={listMonth}
                        defaultValue={[]}
                        onChange={(e, v) => setListMonth(v)}
                        options={months}
                        getOptionLabel={(option) => option.name}
                        // defaultValue={null}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Chọn tháng sinh"
                                placeholder="Chọn tháng sinh"
                                variant="standard"
                            />
                        )}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <Button
                            variant="outlined"
                            sx={{ mr: 1 }}
                            onClick={() => {
                                reset({ endDate: null, startDate: null });
                                console.log('heheh');
                                setGender(-1);
                                setGeneration(-1);
                                setIsActive(-1);
                                setRoleId(-1);
                                setListMonth([]);
                            }}
                        >
                            Reset
                        </Button>
                        <Button variant="contained" type="submit">
                            Lọc
                        </Button>
                    </Box>
                </Box>
            </Grow>
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
            {/* <TextField onChange={(e) => searchJson(e.target.value)}></TextField> */}
            <Dialog open={openUploadFile} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Tải lên file Excel</DialogTitle>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box>
                            <Button variant="outlined" component="span" sx={{ mb: 1, mr: 2 }} onClick={exportExcel}>
                                Tải File mẫu
                            </Button>
                            {errorList.length > 0 ? (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    component="span"
                                    sx={{ mr: 1 }}
                                    onClick={exportErrorList}
                                >
                                    Tải danh sách người bị lỗi
                                </Button>
                            ) : null}
                        </Box>

                        <input type="file" accept=".xlsx" {...register('file')} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Hủy</Button>
                        <Button type="submit">Xác nhận</Button>
                    </DialogActions>
                </Box>
            </Dialog>
            <Typography
                variant="button"
                color="initial"
                sx={{
                    marginLeft: 'auto',
                    marginRight: '1rem',
                    position: 'absolute',
                    top: '262px',
                    left: '38px',
                    zIndex: 2,
                }}
            >
                Tổng thành viên Active: {countActive}/{userList.length}
            </Typography>
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
                        <MenuItem value="Summer2022">Summer 2022</MenuItem>
                        <MenuItem value="Spring2022">Spring 2022</MenuItem>
                    </TextField>
                </Box>
                <Box>
                    {user.role.name === 'ROLE_HeadClub' || user.role.name === 'ROLE_ViceHeadClub' ? (
                        <>
                            <Button
                                variant="outlined"
                                sx={{ marginRight: 2 }}
                                startIcon={<AddCircleIcon />}
                                onClick={() => setIsOpenAddMember(true)}
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
                        </>
                    ) : null}

                    <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} onClick={exportExcel}>
                        Xuất Excel {selectedRows.length > 0 ? `đã chọn (${selectedRows.length})` : `toàn bộ danh sách`}
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    position: 'relative',
                    zIndex: '2',
                    top: '37px',
                    right: '220px',
                }}
            >
                <Badge
                    badgeContent={filterCount}
                    color="primary"
                    // overlap="circular"
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        size="small"
                        onClick={toggleFilter}
                        sx={{ mr: 1 }}
                    >
                        BỘ LỌC
                    </Button>
                </Badge>
            </Box>
            <Box
                sx={{
                    height: '70vh',
                    width: '100%',
                    'button.MuiButton-sizeSmall': { display: 'none !important' },
                }}
            >
                <DataGrid
                    disableColumnFilter
                    disableColumnSelector
                    disableDensitySelector
                    checkboxSelection
                    rows={rowsUser}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[30, 50, 70]}
                    onCellDoubleClick={(param) => {
                        handleOnClick(param.row);
                    }}
                    localeText={{
                        toolbarColumns: 'Cột',
                        toolbarFilters: 'Bộ lọc tìm kiếm',
                    }}
                    components={{
                        Toolbar: GridToolbar,
                        Footer: CustomFooter,
                    }}
                    // initialState={{
                    //     filter: {
                    //         filterModel: {
                    //             items: [],
                    //             quickFilterLogicOperator: GridLinkOperator.Or,
                    //         },
                    //     },
                    // }}
                    componentsProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                        },
                    }}
                    disableSelectionOnClick={true}
                    onSelectionModelChange={(ids) => {
                        setSelectionModel(ids);
                        const selectedIDs = new Set(ids);
                        const selectedRows = userList && userList.filter((row) => selectedIDs.has(row.id));
                        setSelectedRows(selectedRows);
                        // console.log(selectedRows);
                        console.log('selected', selectedRows);
                    }}
                />
            </Box>
        </Fragment>
    );
}

export default MemberAndCollaborator;
