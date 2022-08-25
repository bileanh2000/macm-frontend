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
import { useSnackbar } from 'notistack';
import CreateArea from './CreateArea';
import EditArea from './EditArea';

function AreaSetting({ title, isOpen, handleClose }) {
    const { enqueueSnackbar } = useSnackbar();
    const [area, setArea] = useState();
    const [datas, setDatas] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [isRender, setIsRender] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false);

    const getAllArea = async () => {
        try {
            const response = await adminTournamentAPI.getAllArea();
            console.log('getAllArea', response.data);
            setDatas(response.data);
        } catch (error) {}
    };

    const updateListArea = async (data) => {
        try {
            const response = await adminTournamentAPI.updateListArea(data);
            enqueueSnackbar(response.message, {
                // variant: response.message.toLowerCase().includes('thành công') ? 'success' : 'error',
                variant: 'success',
            });
        } catch (error) {}
    };

    useEffect(() => {
        isRender && getAllArea();
        setIsRender(false);
    }, [isRender, datas]);

    const handleEdit = (params) => {
        setArea(params);
        setEditDialogOpen(true);
    };

    const handleSubmit = () => {
        updateListArea(datas);
        handleClose && handleClose();
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
            {area && (
                <EditArea
                    isOpen={editDialogOpen}
                    area={area}
                    handleClose={() => {
                        setArea();
                        setEditDialogOpen(false);
                    }}
                    onSucess={(newItem) => {
                        // setIsRender(true);
                        const newData = datas.map((data) => (data.id === newItem.id ? newItem : data));
                        setDatas(newData);
                        setArea();
                        setEditDialogOpen(false);
                    }}
                    datas={datas.filter((data) => data.id !== area.id)}
                />
            )}
            <CreateArea
                isOpen={createDialogOpen}
                handleClose={() => {
                    setCreateDialogOpen(false);
                }}
                onSucess={(newItem) => {
                    // setIsRender(true);
                    setDatas([...datas, newItem]);
                    setCreateDialogOpen(false);
                }}
                datas={datas}
            />
            <DialogTitle id="alert-dialog-title">
                {title}
                <Button
                    variant="outlined"
                    sx={{ float: 'right' }}
                    onClick={() => setCreateDialogOpen(true)}
                    startIcon={<AddCircle />}
                >
                    Thêm sân thi đấu
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
                                        Số lượng sân thi đấu hiện tại : {datas.length}
                                    </caption>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Tên sân </TableCell>
                                            <TableCell align="center">Trạng thái</TableCell>
                                            <TableCell align="center"></TableCell>
                                            <TableCell align="center"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {datas.map((data) => (
                                            <TableRow key={data.id}>
                                                <TableCell align="center">{data.name}</TableCell>
                                                <TableCell align="center">
                                                    {data.isActive ? 'Có thể sử dụng' : 'Không thể sử dụng'}
                                                </TableCell>
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
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                        handleSubmit();
                    }}
                    sx={{ mr: 1 }}
                >
                    Lưu lại
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AreaSetting;
