import React, { useEffect, useState } from 'react';
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
import { useSnackbar } from 'notistack';

import adminTournamentAPI from 'src/api/adminTournamentAPI';
import EditExhibitionTournament from './EditExhibitionTournament';
import CreateExhibitionTournament from './CreateExhibitionTournament';

function ExhibitionSetting({ title, isOpen, handleClose }) {
    const { enqueueSnackbar } = useSnackbar();
    const [datas, setDatas] = useState([]);
    const [exhibition, setExhibition] = useState();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [isRender, setIsRender] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false);

    const getAllSuggestType = async () => {
        try {
            const response = await adminTournamentAPI.getAllSuggestType();
            console.log('getAllSuggestType', response.data);
            setDatas(response.data[0].exhibitionTypeSamples);
        } catch (error) {}
    };

    const deleteExhibition = async (role) => {
        try {
            const response = await adminTournamentAPI.deleteExhibitionTypeSample(role.id);
            enqueueSnackbar(response.message, { variant: 'success' });
            setIsRender(true);
        } catch (error) {
            console.log('Xóa rule thất bại', error);
        }
    };

    useEffect(() => {
        isRender && getAllSuggestType();
        setIsRender(false);
    }, [isRender, datas]);

    const handleEdit = (data) => {
        setExhibition(data);
        setEditDialogOpen(true);
    };

    const handleDelete = (params) => {
        setOpenConfirm(true);
        setExhibition(params);
    };

    const handleCloseConfirm = () => {
        setExhibition();
        setOpenConfirm(false);
    };

    const handleOpenConfirm = () => {
        deleteExhibition(exhibition);
        const newRules = datas.filter((r) => {
            return r.id !== exhibition.id;
        });
        setDatas(newRules);
        setExhibition();
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
            {datas && exhibition && (
                <EditExhibitionTournament
                    isOpen={editDialogOpen}
                    exhibition={exhibition}
                    handleClose={() => {
                        setExhibition();
                        setEditDialogOpen(false);
                    }}
                    onSucess={() => {
                        setExhibition();
                        setIsRender(true);
                        setEditDialogOpen(false);
                    }}
                    datas={datas}
                />
            )}
            {datas && (
                <CreateExhibitionTournament
                    isOpen={createDialogOpen}
                    handleClose={() => {
                        setCreateDialogOpen(false);
                        setCreateDialogOpen(false);
                    }}
                    onSucess={() => {
                        setIsRender(true);
                        setCreateDialogOpen(false);
                    }}
                    datas={datas}
                />
            )}
            {exhibition && (
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
                        Bạn có chắc chắn muốn xóa thể thức <strong>{exhibition.name}</strong> này?
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
                    Thêm thể thức thi đấu
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
                            <TableContainer sx={{ maxHeight: 350, m: 1, p: 1, mb: 2 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <caption style={{ captionSide: 'top' }}>
                                        Số lượng thể thức biểu diễn hiện tại : {datas.length}
                                    </caption>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Nội dung thi đấu</TableCell>
                                            <TableCell align="center">Số lượng nam</TableCell>
                                            <TableCell align="center">Số lượng nữ</TableCell>
                                            <TableCell align="center"></TableCell>
                                            <TableCell align="center"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {datas.map((data) => (
                                            <TableRow key={data.id}>
                                                <TableCell>{data.name}</TableCell>
                                                <TableCell align="center">{data.numberMale}</TableCell>
                                                <TableCell align="center">{data.numberFemale}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        aria-label="delete"
                                                        onClick={() => {
                                                            // handleOpenDialog();
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
                                                            // handleOpenDialog();
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

export default ExhibitionSetting;
