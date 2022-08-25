import { AddCircle, Delete, Edit } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import adminTournamentAPI from 'src/api/adminTournamentAPI';
import EditRoleTournament from './EditRoleTournament';
import CreateRoleTournament from './CreateRoleTournament';
import { useSnackbar } from 'notistack';

function RolesSetting({ title, isOpen, handleClose }) {
    const { enqueueSnackbar } = useSnackbar();
    const [datas, setDatas] = useState([]);
    const [role, setRole] = useState();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [isRender, setIsRender] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false);

    const getAllRoleTournament = async () => {
        try {
            const response = await adminTournamentAPI.getAllRoleTournament();
            console.log('getAllRoleTournament', response.data);
            setDatas(response.data);
        } catch (error) {}
    };

    const deleteRole = async (role) => {
        try {
            const response = await adminTournamentAPI.deleteRoleTournament(role.id);
            enqueueSnackbar(response.message, { variant: 'success' });
            setIsRender(true);
        } catch (error) {
            console.log('Xóa rule thất bại', error);
        }
    };

    useEffect(() => {
        isRender && getAllRoleTournament();
        setIsRender(false);
    }, [isRender, datas]);

    const handleEdit = (params) => {
        setRole(params);
        setEditDialogOpen(true);
    };

    const handleDelete = (params) => {
        setOpenConfirm(true);
        setRole(params);
    };

    const handleCloseConfirm = () => {
        setRole();
        setOpenConfirm(false);
    };

    const handleOpenConfirm = () => {
        deleteRole(role);
        const newRules = datas.filter((r) => {
            return r.id !== role.id;
        });
        setDatas(newRules);
        setRole();
        handleCloseConfirm();
    };

    return (
        <Dialog
            fullWidth
            maxWidth="lg"
            open={!!isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {role && (
                <EditRoleTournament
                    isOpen={editDialogOpen}
                    role={role}
                    handleClose={() => {
                        setRole();
                        setEditDialogOpen(false);
                    }}
                    onSucess={() => {
                        setRole();
                        setIsRender(true);
                    }}
                />
            )}
            <CreateRoleTournament
                isOpen={createDialogOpen}
                handleClose={() => {
                    setCreateDialogOpen(false);
                }}
                onSucess={() => {
                    setIsRender(true);
                }}
                datas={datas}
            />
            {role && (
                <Dialog
                    fullWidth
                    maxWidth="md"
                    open={openConfirm}
                    onClose={handleCloseConfirm}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        Xác nhận
                    </DialogTitle>
                    <DialogContent>
                        Bạn có chắc chắn muốn xóa vai trò <strong>{role.name}</strong> này?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirm}>Hủy</Button>
                        <Button onClick={handleOpenConfirm} autoFocus>
                            Xác nhận
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            <DialogTitle id="alert-dialog-title">
                {title}
                <Button
                    variant="outlined"
                    sx={{ float: 'right' }}
                    onClick={() => setCreateDialogOpen(true)}
                    startIcon={<AddCircle />}
                >
                    Thêm vai trò
                </Button>
            </DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        '& .MuiTextField-root': { mb: 2 },
                    }}
                >
                    <Box>
                        {datas.length > 0 && (
                            <TableContainer sx={{ maxHeight: 300, m: 1, p: 1 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <caption style={{ captionSide: 'top' }}>
                                        Số lượng vai trò hiện tại : {datas.length}
                                    </caption>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Tên vai trò</TableCell>
                                            <TableCell align="center"></TableCell>
                                            <TableCell align="center"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {datas.map((data) => (
                                            <TableRow key={data.id}>
                                                <TableCell align="center">{data.name}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        aria-label="edit"
                                                        onClick={() => {
                                                            handleEdit(data);
                                                        }}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        aria-label="delete"
                                                        onClick={() => {
                                                            handleDelete(data);
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
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    color="error"
                    onClick={() => {
                        handleClose();
                    }}
                    sx={{ mr: 1 }}
                >
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RolesSetting;
