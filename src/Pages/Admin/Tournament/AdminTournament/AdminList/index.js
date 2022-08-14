import React, { Fragment, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip,
    Typography,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import RegisterAdmin from './RegisterAdmin';
import userTournamentAPI from 'src/api/userTournamentAPI';
import adminTournament from 'src/api/adminTournamentAPI';

function AdminList({ adminList, value, index, active, total, isUpdate, user, Success, tournamentId, onChange }) {
    const { enqueueSnackbar } = useSnackbar();
    const [data, setData] = useState(adminList);
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState(false);
    const [roleInTournament, setRoleInTournament] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);
    const [tournamentAdminId, setTournamentAdminId] = useState();
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    useEffect(() => {
        setData(adminList);
    }, [adminList]);

    const handleRowEditCommit = React.useCallback(
        (params) => {
            const id = params.id;
            const key = params.field;
            const value = params.value;
            console.log(id, key, value, params);
            const newRole = roleInTournament.find((role) => role.name == value);
            console.log(newRole);
            console.log(data);
            const newAdminList = data.map((member) =>
                member.id === id ? { ...member, roleTournamentDto: newRole } : member,
            );
            setData(newAdminList);
            setIsEdit(true);
        },
        [data, roleInTournament],
    );

    const handleUpdate = () => {
        console.log('submit', data);
        adminTournament.updateTournamentOrganizingCommitteeRole(data).then((res) => {
            console.log(res);
            console.log(res.data);
            enqueueSnackbar(res.message, { variant: 'success' });
            onChange && onChange();
        });
        setOpenDialog(false);
        setIsEdit(false);
        // navigate(-1);
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialogSave = () => {
        setOpenDialog(false);
    };
    const handleOpenDialogSave = () => {
        setOpenDialog(true);
    };

    const deleteTournamentOrganizingCommittee = async (tournamentAdminId) => {
        try {
            const response = await adminTournament.deleteTournamentOrganizingCommittee(tournamentAdminId);
            onChange && onChange();
            enqueueSnackbar(response.message, {
                variant: response.message.includes('Không thể xóa') ? 'error' : 'success',
            });
        } catch (error) {
            console.warn('Failed to delete competitive player');
        }
    };

    useEffect(() => {
        const getRoleInTournament = async () => {
            try {
                const response = await userTournamentAPI.getAllOrginizingCommitteeRole(tournamentId);
                console.log(response);
                setRoleInTournament(response.data);
            } catch (error) {
                console.log('Khong the lay duoc role', error);
            }
        };
        getRoleInTournament();
    }, [tournamentId]);

    const columns = [
        { field: 'studentName', headerName: 'Tên', flex: 0.6 },
        {
            field: 'studentId',
            headerName: 'Mã sinh viên',
            width: 150,
            flex: 0.3,
        },
        {
            field: 'role',
            headerName: `Vai trò trong giải đấu`,
            width: 150,
            flex: 0.6,
            editable: !isUpdate,
            type: 'singleSelect',
            valueOptions: roleInTournament.map((role) => {
                return { label: role.name, value: role.name };
            }),
            renderCell: (params) => (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{params.value}</span>
                    <Tooltip title={!isUpdate ? 'DoubleClick để chỉnh sửa vai trò' : 'Hết thời hạn cập nhật vai trò'}>
                        <span>
                            <GridActionsCellItem icon={<Edit />} label="Edit" sx={{ ml: 2 }} />
                        </span>
                    </Tooltip>
                </Box>
            ),
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('role-edit');
            },
        },
        {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <Tooltip title={!isUpdate ? 'Xóa khỏi ban tổ chức' : 'Hết thời hạn xóa'}>
                    {/* <span> */}
                    <GridActionsCellItem
                        icon={<Delete />}
                        label="Delete"
                        onClick={(e) => (!isUpdate ? deleteUser(params.row) : e.stopPropagation())}
                        disabled={isUpdate}
                        // touchRippleRef
                    />
                    {/* </span> */}
                </Tooltip>,
            ],
        },
    ];

    const rowsUser =
        data &&
        data.map((item, index) => {
            const container = {};
            container['id'] = item.id;
            container['studentName'] = item.userName;
            container['studentId'] = item.userStudentId;
            container['role'] = item.roleTournamentDto.name;
            container['registerStatus'] = item.registerStatus;
            container['paymentStatus'] = item.paymentStatus ? 'Đã đóng' : 'Chưa đóng';
            return container;
        });

    const deleteUser = (tournamentAdminId) => {
        setTournamentAdminId(tournamentAdminId);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const handleConfirmDelete = () => {
        deleteTournamentOrganizingCommittee(tournamentAdminId.id);
        handleCloseDelete();
    };

    function CustomToolbar() {
        return (
            <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
                <Box
                    sx={{
                        p: 0.5,
                        pb: 0,
                    }}
                >
                    <GridToolbarQuickFilter />
                </Box>

                <Box>
                    <Typography variant="button" color="initial" sx={{ marginLeft: 'auto', marginRight: '1rem' }}>
                        Tổng thành viên Ban tổ chức: {total} người
                    </Typography>
                    {!isUpdate && roleInTournament.length > 0 && (
                        <Button
                            startIcon={<Add />}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 2, ml: 2 }}
                            onClick={() => handleOpenDialog(true)}
                        >
                            Thêm người thành viên
                        </Button>
                    )}
                </Box>
            </GridToolbarContainer>
        );
    }
    const StyledGridOverlay = styled('div')(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        '& .ant-empty-img-1': {
            fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
        },
        '& .ant-empty-img-2': {
            fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
        },
        '& .ant-empty-img-3': {
            fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
        },
        '& .ant-empty-img-4': {
            fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
        },
        '& .ant-empty-img-5': {
            fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
            fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
        },
    }));
    function CustomNoRowsOverlay() {
        return (
            <StyledGridOverlay>
                <svg width="120" height="100" viewBox="0 0 184 152" aria-hidden focusable="false">
                    <g fill="none" fillRule="evenodd">
                        <g transform="translate(24 31.67)">
                            <ellipse className="ant-empty-img-5" cx="67.797" cy="106.89" rx="67.797" ry="12.668" />
                            <path
                                className="ant-empty-img-1"
                                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                            />
                            <path
                                className="ant-empty-img-2"
                                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                            />
                            <path
                                className="ant-empty-img-3"
                                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                            />
                        </g>
                        <path
                            className="ant-empty-img-3"
                            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                        />
                        <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                        </g>
                    </g>
                </svg>
                <Box sx={{ mt: 1 }}>Danh sách trống</Box>
            </StyledGridOverlay>
        );
    }
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            sx={{
                height: '70vh',
                width: '100%',
                mt: '1rem',
                display: 'flex',
                flexDirection: 'column',
                // '& .role-edit::after': {
                //     // backgroundColor: 'red !important',
                //     content: "'\\270E'",
                //     // color: 'red',
                //     fontSize: '1.2rem',
                // },
                '& .role-edit:hover': {
                    // backgroundColor: '#655151 !important',
                    border: '1px dashed #655151',
                    // content: "'\\270E'",
                    // // color: 'red',
                    // fontSize: '1.2rem',
                },
                '& .status-rows': {
                    justifyContent: 'center !important',
                    minHeight: '0px !important',
                    maxHeight: '35px !important',
                    borderRadius: '100px',
                    position: 'relative',
                    top: '9px',
                },
                '& .status-rows.active': {
                    backgroundColor: '#56f000',
                    color: '#fff',
                    fontWeight: '600',
                    textAlign: 'center',
                    // minWidth: '80px !important',
                },
                '& .status-rows.deactive': {
                    backgroundColor: '#ff3838',
                    color: '#fff',
                    fontWeight: '600',
                    // minWidth: '80px !important',
                },
            }}
        >
            {isEdit && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={handleOpenDialogSave} sx={{ m: 1 }} disabled={!isEdit}>
                        Lưu lại
                    </Button>
                </Box>
            )}
            <DataGrid
                // loading={data.length === 0}
                disableSelectionOnClick={true}
                rows={rowsUser}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 30]}
                components={{
                    Toolbar: CustomToolbar,
                    NoRowsOverlay: CustomNoRowsOverlay,
                }}
                onCellEditCommit={handleRowEditCommit}
            />

            {tournamentAdminId && (
                <Dialog
                    // fullWidth
                    // maxWidth="md"
                    open={openDelete}
                    onClose={handleCloseDelete}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        Xác nhận
                    </DialogTitle>
                    <DialogContent>
                        Bạn có chắc chắn muốn xóa <strong>{tournamentAdminId.studentName}</strong> ra khỏi ban tổ chức
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={handleCloseDelete}>
                            Hủy
                        </Button>
                        <Button variant="contained" onClick={handleConfirmDelete} autoFocus>
                            Đồng ý
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {roleInTournament.length > 0 && (
                <RegisterAdmin
                    title="Đăng kí tham gia ban tổ chức"
                    isOpen={open}
                    handleClose={() => {
                        setOpen(false);
                    }}
                    user={user}
                    roles={roleInTournament}
                    onSuccess={(newItem) => {
                        // if (competitivePlayer.find((player) => player.playerStudentId == newItem.playerStudentId)) {
                        //     return;
                        // }
                        // setCompetitivePlayer([...newItem, ...competitivePlayer]);
                        Success && Success(newItem);
                        setOpen(false);
                    }}
                    onChange={onChange}
                />
            )}

            <Dialog
                open={openDialog}
                onClose={handleCloseDialogSave}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Xác nhận</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Bạn có muốn lưu các thay đổi ?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleCloseDialogSave}>
                        Hủy bỏ
                    </Button>
                    <Button variant="contained" onClick={handleUpdate} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AdminList;
