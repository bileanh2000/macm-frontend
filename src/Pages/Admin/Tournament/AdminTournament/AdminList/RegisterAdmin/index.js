import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    MenuItem,
    Paper,
    Select,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import AddAdmin from './AddAdmin';
import adminTournament from 'src/api/adminTournamentAPI';
import userTournamentAPI from 'src/api/userTournamentAPI';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import { Edit } from '@mui/icons-material';

function RegisterAdmin({ isOpen, handleClose, onSuccess, roles, user, onChange }) {
    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [admin, setAdmin] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [allMember, setAllMember] = useState([]);
    const [pageSize, setPageSize] = useState(5);
    const [selectedRows, setSelectedRows] = useState([]);
    // const [roleInTournament, setRoleInTournament] = useState([]);

    const AddPlayerHandler = (data) => {
        setAdmin(data);
    };

    const handleCloseDialog = () => {
        setAdmin([]);
        // reset({
        //     weight: '',
        // });
        handleClose && handleClose();
    };

    const addListOrganizingCommittee = async () => {
        try {
            const response = await adminTournament.addListOrganizingCommittee(
                user.studentId,
                tournamentId,
                selectedRows,
            );
            enqueueSnackbar(response.message, { variant: response.data ? 'success' : 'error' });
            onChange && onChange();
        } catch (error) {}
    };

    const handleRegister = (data) => {
        // const params = { userId: player[0].id, competitiveTypeId: weightRange, weight: data.weight, tournamentId };
        if (selectedRows.length === 0) {
            let variant = 'error';
            enqueueSnackbar('Vui lòng chọn thông tin vận động viên', { variant });
            return;
        }

        addListOrganizingCommittee();
        const newPlayer = selectedRows.map((p) => {
            return {
                id: p.user.id,
                userName: p.user.name,
                userStudentId: p.user.studentId,
                registerStatus: 'Đã chấp nhận',
                paymentStatus: false,
                roleTournamentDto: {
                    id: p.roleId,
                    name: roles.find((role) => role.id == p.roleId).name,
                },
            };
        });
        console.log(newPlayer);
        onSuccess && onSuccess(newPlayer);
        setAdmin([]);
        // reset({
        //     weight: '',
        // });
        handleClose && handleClose();
    };

    const handleRowEditCommit = React.useCallback(
        (params) => {
            const id = params.id;
            const key = params.field;
            const value = params.value;
            console.log(id, key, value, params);
            const newRole = roles.find((role) => role.name == value);
            console.log(newRole);
            console.log('old', admin);
            const newAdminList = admin.map((member) =>
                member.user.id === id ? { ...member, roleId: newRole.id } : member,
            );
            console.log('new', newAdminList);
            setAdmin(newAdminList);
        },
        [admin, roles],
    );

    const columns = [
        { field: 'studentName', headerName: 'Tên', flex: 0.8 },
        {
            field: 'studentId',
            headerName: 'Mã sinh viên',
            width: 150,
            flex: 0.6,
        },
        {
            field: 'role',
            headerName: `Vai trò trong giải đấu`,
            width: 150,
            flex: 0.6,
            editable: true,
            type: 'singleSelect',
            valueOptions: roles.map((role) => {
                return { label: role.name, value: role.name };
            }),
            preProcessEditCellProps: (params) => {
                const isPaidProps = params.otherFieldsProps.isPaid;
                const hasError = isPaidProps.value && !params.props.value;
                return { ...params.props, error: hasError };
            },
            renderCell: (params) => (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{params.value}</span>
                    <Tooltip title="DoubleClick để chỉnh sửa vai trò">
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
    ];

    const rowsUser =
        allMember.length > 0 &&
        allMember.map((item, index) => {
            const container = {};
            container['id'] = item.user.id;
            container['studentName'] = item.user.name;
            container['studentId'] = item.user.studentId;
            container['role'] = roles.find((role) => role.id == item.roleId).name;
            return container;
        });

    useEffect(() => {
        const getAllMember = async (tournamentId) => {
            try {
                const response = await adminTournament.getAllUserNotJoinTournament(tournamentId);
                console.log(response.data);
                if (response.data.length > 0) {
                    const newAllMemberWithRole = response.data.map((data) => {
                        return { roleId: roles[0].id, user: data };
                    });
                    setAllMember(newAllMemberWithRole);
                } else {
                    setAllMember([]);
                }
            } catch (error) {
                console.log('khong the lay data');
            }
        };
        getAllMember(tournamentId);
    }, [tournamentId, roles]);

    const CustomToolbar = () => {
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
            </GridToolbarContainer>
        );
    };

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
        <Dialog
            open={!!isOpen}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Thêm thành viên vào ban tổ chức</DialogTitle>
            <DialogContent>
                {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: 2 }}>
                    {allMember && <AddAdmin data={admin} onAddPlayer={AddPlayerHandler} allMember={allMember} />}
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ width: '100%', minHeight: 400 }}>
                            {admin.length > 0 && (
                                <Box
                                    sx={{
                                        height: '60vh',
                                        width: '100%',
                                        '& .role-edit:hover': {
                                            // backgroundColor: '#655151 !important',
                                            border: '1px dashed #655151',
                                            // content: "'\\270E'",
                                            // // color: 'red',
                                            // fontSize: '1.2rem',
                                        },
                                    }}
                                >
                                    <DataGrid
                                        // loading={!adminList.length}
                                        disableSelectionOnClick={true}
                                        rows={rowsUser}
                                        columns={columns}
                                        pageSize={pageSize}
                                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                        rowsPerPageOptions={[5, 10, 20]}
                                        components={{
                                            Toolbar: CustomToolbar,
                                            NoRowsOverlay: CustomNoRowsOverlay,
                                        }}
                                        onCellEditCommit={handleRowEditCommit}
                                    />
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid> */}
                <Box sx={{ height: '500px' }}>
                    <DataGrid
                        rows={rowsUser}
                        checkboxSelection
                        onSelectionModelChange={(ids) => {
                            setSelectionModel(ids);
                            const selectedIDs = new Set(ids);
                            const selectedRows =
                                allMember &&
                                allMember.filter((row) => {
                                    selectedIDs.has(row.id);
                                });
                            setSelectedRows(selectedRows);
                            console.log(selectedRows);
                            console.log('addMemberToEvent', selectedRows);
                        }}
                        disableSelectionOnClick={true}
                        columns={columns}
                        pageSize={pageSize}
                        rowsPerPageOptions={[30, 40, 50]}
                        components={{
                            Toolbar: CustomToolbar,
                            NoRowsOverlay: CustomNoRowsOverlay,
                        }}
                        onCellEditCommit={handleRowEditCommit}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleCloseDialog}>
                    Hủy
                </Button>
                <Button variant="contained" onClick={handleRegister} autoFocus disabled={selectionModel.length === 0}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RegisterAdmin;
