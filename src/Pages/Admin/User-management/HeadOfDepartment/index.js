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
import AddMemberDialog from '../AddMemberDialog';
import ViewDetailMemberDialog from '../ViewDetailMemberDialog';

function HeadOfDepartment() {
    let navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [stageStudentId, setStageStudentID] = useState({ studentId: '', name: '' });
    const [semester, setSemester] = useState('Summer2022');
    const [editable, setEditable] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState([]);

    const [isOpenAddMember, setIsOpenAddMember] = useState(false);
    const [isOpenViewMember, setIsOpenViewMember] = useState(false);
    const [isEditDialog, setIsEditDialog] = useState(false);
    const user = JSON.parse(localStorage.getItem('currentUser'));

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
    };
    useEffect(() => {
        console.log(stageStudentId);
    }, [stageStudentId]);
    const columns = [
        // { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'name', headerName: 'Tên', flex: 1 },
        { field: 'studentId', headerName: 'Mã sinh viên', flex: 0.9 },

        {
            field: 'email',
            headerName: 'Email',
            width: 220,
            renderCell: (params) => <Link href={`mailto:${params.value}`}>{params.value.toString()}</Link>,
            flex: 1,
        },

        { field: 'gender', headerName: 'Giới tính', flex: 0.5 },
        { field: 'dateOfBirth', headerName: 'Ngày sinh', flex: 0.7 },
        { field: 'month', headerName: 'Tháng sinh', flex: 0.5, hide: true, hideable: false },
        { field: 'generation', headerName: 'Gen', flex: 0.5 },
        { field: 'role', headerName: 'Vai trò', flex: 1 },
        {
            hideable: !editable,
            ...(user.role.name === 'ROLE_HeadClub' || user.role.name === 'ROLE_ViceHeadClub'
                ? { hide: editable }
                : { hide: true }),

            field: 'actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />} label="Chỉnh sửa" onClick={() => editUser(params)} />,

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
        container['id'] = item.id;
        container['name'] = item.name;
        container['email'] = item.email;
        container['gender'] = item.gender ? 'Nam' : 'Nữ';
        container['dateOfBirth'] = moment(new Date(item.dateOfBirth)).format('DD/MM/yyyy');
        container['generation'] = item.generation;
        container['month'] = new Date(item.dateOfBirth).getMonth() + 1;
        container['studentId'] = item.studentId;
        container['role'] = item.roleName;
        container['active'] = item.active ? 'Active' : 'Deactive';
        container['phone'] = item.phone;
        container['image'] = item.image;
        container['currentAddress'] = item.currentAddress;
        container['roleId'] = item.roleId;

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
        setSelectedStudent(rowData);
        setIsOpenViewMember(true);
        setIsEditDialog(false);
    };
    const editUser = (params) => {
        setSelectedStudent(params.row);
        setIsOpenViewMember(true);
        setIsEditDialog(true);
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
            <AddMemberDialog
                title="Thêm thành viên"
                isOpen={isOpenAddMember}
                handleClose={() => setIsOpenAddMember(false)}
                onSucess={(newUser) => {
                    setUserList([newUser, ...userList]);
                }}
            />
            {isOpenViewMember && (
                <ViewDetailMemberDialog
                    // title="Thông tin thành viên"
                    selectedStudent={selectedStudent}
                    isOpen={isOpenViewMember}
                    handleClose={() => setIsOpenViewMember(false)}
                    editable={isEditDialog}
                    adminRole={true}
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
                                        role: updatedUser.roleName,
                                        phone: updatedUser.phone,
                                        currentAddress: updatedUser.currentAddress,
                                        roleId: updatedUser.roleId,
                                    };
                                }
                                return user;
                            });
                        });
                    }}
                />
            )}
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
                    // loading={!userList.length}
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

export default HeadOfDepartment;
