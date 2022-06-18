import { Fragment, useEffect, useState, useCallback } from 'react';
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
} from '@mui/x-data-grid';
import { Alert, Box, Button, Snackbar, styled } from '@mui/material';
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
import { useForm } from 'react-hook-form';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import clsx from 'clsx';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const fileTypes = ['CSV', 'JPG', 'png'];
const Input = styled('input')({
    display: 'none',
});
function DragDrop() {
    const [aFile, setAFile] = useState(null);

    const handleChange = async (file) => {
        setAFile(file);
        // await userApi.uploadCSV(aFile).then((res) => {
        //     console.log('1', res);
        //     console.log('2', res.data);
        //     if (res.data.length != 0) {
        //         // setSnackBarStatus(true);
        //     } else {
        //         console.log('huhu');
        //         // setSnackBarStatus(false);
        //     }
        // });
    };

    useEffect(() => {
        console.log(aFile);
    }, [aFile]);

    return (
        <div className="dragdrop">
            <FileUploader
                multiple={true}
                onTypeError={(err) => console.log(err)}
                name="file"
                types={fileTypes}
                handleChange={handleChange}
            />
            <p>{aFile ? `File name: ${aFile[0].name}` : ''}</p>
        </div>
    );
}

function MemberAndCollaborator() {
    let navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [openUploadFile, setOpenUploadFile] = useState(false);

    const handleClickOpen = () => {
        setOpenUploadFile(true);
    };

    const handleClose = () => {
        setOpenUploadFile(false);
    };

    useEffect(() => {
        fetchUserList();
    }, []);

    const fetchUserList = async () => {
        try {
            const response = await userApi.getAll();
            console.log(response);
            setUserList(response.data);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        // resolver: yupResolver(validationSchema),
        // mode: 'onBlur',
    });
    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'name', headerName: 'Tên', flex: 0.8 },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
            renderCell: (params) => <Link href={`mailto:${params.value}`}>{params.value.toString()}</Link>,
            flex: 1,
        },

        { field: 'gender', headerName: 'Giới tính', flex: 0.5 },
        { field: 'studentId', headerName: 'Mã sinh viên', width: 150, flex: 0.6 },
        { field: 'role', headerName: 'Vai trò', width: 200, flex: 1.2 },
        {
            field: 'active',
            headerName: 'Trạng thái',
            flex: 0.5,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('status-rows', {
                    active: params.value === 'Active',
                    deactive: params.value === 'Deactive',
                });
            },
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 0.5,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />} label="Chỉnh sửa" onClick={editUser(params.row.studentId)} />,
                <GridActionsCellItem
                    icon={<SecurityIcon />}
                    label="Chuyển trạng thái"
                    onClick={toggleStatus(params.row.studentId)}
                />,
            ],
        },
    ];

    const rowsUser = userList.map((item, index) => {
        const container = {};
        container['id'] = index + 1;
        container['name'] = item.name;
        container['email'] = item.email;
        container['gender'] = item.gender ? 'Nam' : 'Nữ';
        container['studentId'] = item.studentId;
        container['role'] = item.role.name;
        container['active'] = item.active ? 'Active' : 'Deactive';

        return container;
    });

    // const [rows, setRows] = useState();
    // setRows(rowsUser);

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
    const toggleStatus = useCallback(
        (id) => () => {
            // fetchUserList();
            console.log(id.active);
            const params = { studentId: id };
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

    // function CustomToolbar() {
    //     return (
    //         <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
    //             <Box
    //                 sx={{
    //                     p: 0.5,
    //                     pb: 0,
    //                 }}
    //             >
    //                 <GridToolbarQuickFilter />
    //             </Box>
    //             {/* <GridToolbarExport
    //                 csvOptions={{
    //                     fileName: 'Danh sách thành viên và cộng tác viên',
    //                     utf8WithBom: true,
    //                 }}
    //             /> */}
    //         </GridToolbarContainer>
    //     );
    // }
    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
            </GridToolbarContainer>
        );
    }
    const top100Films = [
        { title: 'The Shawshank Redemption', year: 1994 },
        { title: 'The Godfather', year: 1972 },
        { title: 'The Godfather: Part II', year: 1974 },
        { title: 'The Dark Knight', year: 2008 },
        { title: '12 Angry Men', year: 1957 },
        { title: "Schindler's List", year: 1993 },
        { title: 'Pulp Fiction', year: 1994 },
        {
            title: 'The Lord of the Rings: The Return of the King',
            year: 2003,
        },
        { title: 'The Good, the Bad and the Ugly', year: 1966 },
        { title: 'Fight Club', year: 1999 },
        {
            title: 'The Lord of the Rings: The Fellowship of the Ring',
            year: 2001,
        },
        {
            title: 'Star Wars: Episode V - The Empire Strikes Back',
            year: 1980,
        },
        { title: 'Forrest Gump', year: 1994 },
        { title: 'Inception', year: 2010 },
        {
            title: 'The Lord of the Rings: The Two Towers',
            year: 2002,
        },
        { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
        { title: 'Goodfellas', year: 1990 },
        { title: 'The Matrix', year: 1999 },
        { title: 'Seven Samurai', year: 1954 },
        {
            title: 'Star Wars: Episode IV - A New Hope',
            year: 1977,
        },
        { title: 'City of God', year: 2002 },
        { title: 'Se7en', year: 1995 },
        { title: 'The Silence of the Lambs', year: 1991 },
        { title: "It's a Wonderful Life", year: 1946 },
        { title: 'Life Is Beautiful', year: 1997 },
        { title: 'The Usual Suspects', year: 1995 },
        { title: 'Léon: The Professional', year: 1994 },
        { title: 'Spirited Away', year: 2001 },
        { title: 'Saving Private Ryan', year: 1998 },
        { title: 'Once Upon a Time in the West', year: 1968 },
        { title: 'American History X', year: 1998 },
        { title: 'Interstellar', year: 2014 },
        { title: 'Casablanca', year: 1942 },
        { title: 'City Lights', year: 1931 },
        { title: 'Psycho', year: 1960 },
        { title: 'The Green Mile', year: 1999 },
        { title: 'The Intouchables', year: 2011 },
        { title: 'Modern Times', year: 1936 },
        { title: 'Raiders of the Lost Ark', year: 1981 },
        { title: 'Rear Window', year: 1954 },
        { title: 'The Pianist', year: 2002 },
        { title: 'The Departed', year: 2006 },
        { title: 'Terminator 2: Judgment Day', year: 1991 },
        { title: 'Back to the Future', year: 1985 },
        { title: 'Whiplash', year: 2014 },
        { title: 'Gladiator', year: 2000 },
        { title: 'Memento', year: 2000 },
        { title: 'The Prestige', year: 2006 },
        { title: 'The Lion King', year: 1994 },
        { title: 'Apocalypse Now', year: 1979 },
        { title: 'Alien', year: 1979 },
        { title: 'Sunset Boulevard', year: 1950 },
        {
            title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
            year: 1964,
        },
        { title: 'The Great Dictator', year: 1940 },
        { title: 'Cinema Paradiso', year: 1988 },
        { title: 'The Lives of Others', year: 2006 },
        { title: 'Grave of the Fireflies', year: 1988 },
        { title: 'Paths of Glory', year: 1957 },
        { title: 'Django Unchained', year: 2012 },
        { title: 'The Shining', year: 1980 },
        { title: 'WALL·E', year: 2008 },
        { title: 'American Beauty', year: 1999 },
        { title: 'The Dark Knight Rises', year: 2012 },
        { title: 'Princess Mononoke', year: 1997 },
        { title: 'Aliens', year: 1986 },
        { title: 'Oldboy', year: 2003 },
        { title: 'Once Upon a Time in America', year: 1984 },
        { title: 'Witness for the Prosecution', year: 1957 },
        { title: 'Das Boot', year: 1981 },
        { title: 'Citizen Kane', year: 1941 },
        { title: 'North by Northwest', year: 1959 },
        { title: 'Vertigo', year: 1958 },
        {
            title: 'Star Wars: Episode VI - Return of the Jedi',
            year: 1983,
        },
        { title: 'Reservoir Dogs', year: 1992 },
        { title: 'Braveheart', year: 1995 },
        { title: 'M', year: 1931 },
        { title: 'Requiem for a Dream', year: 2000 },
        { title: 'Amélie', year: 2001 },
        { title: 'A Clockwork Orange', year: 1971 },
        { title: 'Like Stars on Earth', year: 2007 },
        { title: 'Taxi Driver', year: 1976 },
        { title: 'Lawrence of Arabia', year: 1962 },
        { title: 'Double Indemnity', year: 1944 },
        {
            title: 'Eternal Sunshine of the Spotless Mind',
            year: 2004,
        },
        { title: 'Amadeus', year: 1984 },
        { title: 'To Kill a Mockingbird', year: 1962 },
        { title: 'Toy Story 3', year: 2010 },
        { title: 'Logan', year: 2017 },
        { title: 'Full Metal Jacket', year: 1987 },
        { title: 'Dangal', year: 2016 },
        { title: 'The Sting', year: 1973 },
        { title: '2001: A Space Odyssey', year: 1968 },
        { title: "Singin' in the Rain", year: 1952 },
        { title: 'Toy Story', year: 1995 },
        { title: 'Bicycle Thieves', year: 1948 },
        { title: 'The Kid', year: 1921 },
        { title: 'Inglourious Basterds', year: 2009 },
        { title: 'Snatch', year: 2000 },
        { title: '3 Idiots', year: 2009 },
        { title: 'Monty Python and the Holy Grail', year: 1975 },
    ];
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
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                Quản lý Thành viên và Cộng tác viên
            </Typography>
            <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Box>
                    {/* <Autocomplete
                        id="highlights-demo"
                        sx={{ width: 300, height: 60 }}
                        options={top100Films}
                        getOptionLabel={(option) => option.title}
                        renderInput={(params) => <TextField {...params} label="Highlights" margin="normal" />}
                        renderOption={(props, option, { inputValue }) => {
                            const matches = match(option.title, inputValue);
                            const parts = parse(option.title, matches);

                            return (
                                <li {...props}>
                                    <div>
                                        {parts.map((part, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    fontWeight: part.highlight ? 700 : 400,
                                                }}
                                            >
                                                {part.text}
                                            </span>
                                        ))}
                                    </div>
                                </li>
                            );
                        }}
                    /> */}
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
                        // sx={{ marginRight: 2 }}
                        startIcon={<UploadFileIcon />}
                        onClick={handleClickOpen}
                    >
                        Thêm danh sách thành viên
                    </Button>
                </Box>
            </Box>
            {/* <div style={{ height: '70vh', width: '100%' }}> */}
            <Box
                sx={{
                    height: '70vh',
                    width: '100%',
                    '& .status-rows': {
                        justifyContent: 'center !important',
                        minHeight: '0px !important',
                        maxHeight: '35px !important',
                        borderRadius: '100px',
                        position: 'relative',
                        top: '9px',
                        minWidth: '104.143px !important',
                    },
                    '& .status-rows.active': {
                        backgroundColor: '#56f000',
                        color: '#fff',
                        fontWeight: '600',
                        textAlign: 'center',
                    },
                    '& .status-rows.deactive': {
                        backgroundColor: '#ff3838',
                        color: '#fff',
                        fontWeight: '600',
                    },
                }}
            >
                <DataGrid
                    loading={!userList.length}
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
                    }}
                />
                <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} onClick={exportExcel}>
                    Xuất File Excel
                </Button>
            </Box>
            {/* </div> */}
        </Fragment>
    );
}

export default MemberAndCollaborator;
