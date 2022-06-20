import { Fragment, useEffect, useState, useCallback } from 'react';
import userApi from 'src/api/userApi';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useHistory } from 'react-router-dom';
import Link from '@mui/material/Link';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { MenuItem, TextField } from '@mui/material';
import moment from 'moment';

function MemberAndCollaborator() {
    let navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [stageStudentId, setStageStudentID] = useState({ studentId: '', name: '' });
    const [semester, setSemester] = useState('Summer2022');
    const [editable, setEditable] = useState(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const fetchAdminListBySemester = async (params) => {
        try {
            const response = await userApi.getAllAdminBySemester(params);
            console.log(response);
            setUserList(response.data);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };
    useEffect(() => {
        fetchAdminListBySemester(semester);
    }, [semester]);

    const handleChange = (event) => {
        console.log(event.target.value);
        setSemester(event.target.value);
        if (event.target.value != 'Summer2022') {
            setEditable(true);
        } else {
            setEditable(false);
        }
        console.log(editable);
        fetchAdminListBySemester(semester);
    };
    useEffect(() => {
        console.log(stageStudentId);
    }, [stageStudentId]);
    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'name', headerName: 'Tên', flex: 1 },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
            renderCell: (params) => <Link href={`mailto:${params.value}`}>{params.value.toString()}</Link>,
            flex: 2,
        },

        { field: 'gender', headerName: 'Giới tính', flex: 1 },
        { field: 'dateOfBirth', headerName: 'Ngày sinh', flex: 1 },
        { field: 'month', headerName: 'Tháng sinh', flex: 0.5, hide: true, hideable: false },
        { field: 'generation', headerName: 'Gen', flex: 1 },
        { field: 'studentId', headerName: 'Mã sinh viên', flex: 1 },
        { field: 'role', headerName: 'Vai trò', flex: 1 },
        {
            hideable: !editable,
            hide: editable,
            field: 'actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Delete"
                    onClick={() => {
                        navigate(`${params.row.studentId}/edit`);
                    }}
                />,

                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Xóa"
                    onClick={() => {
                        handleOpenDialog();
                        setStageStudentID({ studentId: params.row.studentId, name: params.row.name });
                    }}
                />,
            ],
        },
    ];

    const rows = userList.map((item, index) => {
        const container = {};
        container['id'] = index + 1;
        container['name'] = item.name;
        container['email'] = item.email;
        container['generation'] = item.generation;
        container['dateOfBirth'] = moment(new Date(item.dateOfBirth)).format('DD/MM/yyyy');
        container['gender'] = item.gender ? 'Nam' : 'Nữ';
        container['studentId'] = item.studentId;
        container['role'] = item.roleName;
        container['month'] = new Date(item.dateOfBirth).getMonth() + 1;

        return container;
    });

    const deleteUser = useCallback(
        (id) => () => {
            handleCloseDialog();
            setTimeout(() => {
                const params = { studentId: id, semester: semester };
                userApi.deleteAdmin(params).then((res) => {
                    setUserList((prevRows) => prevRows.filter((row) => row.studentId !== id));
                    console.log('1', res);
                    console.log('2', res.data);
                });
            });
        },
        [],
    );

    const handleOnClick = (rowData) => {
        // console.log('push -> /roles/' + rowData.studentId);
        let path = `${rowData.studentId}`;
        navigate(path);
        // alert('navigation');
    };
    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
            </GridToolbarContainer>
        );
    }

    return (
        <Fragment>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`Bạn muốn xóa "${stageStudentId.name}" khỏi Ban chủ nhiệm?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        "{stageStudentId.name}" sẽ trở thành thành viên bình thường
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Từ chối</Button>
                    <Button onClick={deleteUser(stageStudentId.studentId)} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 4 }}>
                Quản lý Ban chủ nhiệm
            </Typography>
            <TextField
                sx={{ mb: 2 }}
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
            <div style={{ height: '80vh', width: '100%' }}>
                <DataGrid
                    loading={!userList.length}
                    disableSelectionOnClick={true}
                    rows={rows}
                    columns={columns}
                    pageSize={15}
                    rowsPerPageOptions={[15]}
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
            </div>
        </Fragment>
    );
}

export default MemberAndCollaborator;
