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

import adminTournamentAPI from 'src/api/adminTournamentAPI';
import { useSnackbar } from 'notistack';
import CreateCompetitiveTournament from './CreateCompetitiveTournament';
import EditCompetitiveTournament from './EditCompetitiveTournament';

function CompetitiveSetting({ title, isOpen, handleClose }) {
    const { enqueueSnackbar } = useSnackbar();
    const [datas, setDatas] = useState();
    const [competitive, setCompetitive] = useState();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [isRender, setIsRender] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [weightRangeMale, setWeightRangeMale] = useState([]);
    const [weightRangeFemale, setWeightRangeFemale] = useState([]);
    const [weightRangeTemp, setWeightRangeTemp] = useState([]);

    const deleteCompetitive = async (role) => {
        try {
            const response = await adminTournamentAPI.deleteCompetitiveTypeSample(role.id);
            enqueueSnackbar(response.message, { variant: 'success' });
            setIsRender(true);
        } catch (error) {
            console.log('Xóa rule thất bại', error);
        }
    };

    const getData = (datas) => {
        let weightFemale = [];
        let weightMale = [];
        datas &&
            datas.map((data) => {
                let newWeightRange = [];
                let i;
                for (i = data.weightMin; i < data.weightMax; i = i + 0.5) {
                    newWeightRange.push(i);
                }
                if (!data.gender) {
                    weightFemale = weightFemale.concat(newWeightRange);
                } else {
                    weightMale = weightMale.concat(newWeightRange);
                }
            });
        // console.log(datas, weightFemale, weightMale);
        setWeightRangeFemale(weightFemale);
        setWeightRangeMale(weightMale);
    };

    useEffect(() => {
        const getAllSuggestType = async () => {
            try {
                const response = await adminTournamentAPI.getAllSuggestType();
                console.log('getAllSuggestType', response.data);
                setDatas(response.data[0].competitiveTypeSamples);
                getData(response.data[0].competitiveTypeSamples);
            } catch (error) {}
        };
        isRender && getAllSuggestType();
        setIsRender(false);
    }, [isRender, datas]);

    const handleEdit = (data) => {
        // datas.map((data) => {
        //     return data.id === id;
        // });
        // const data = datas.filter((item) => item.id !== role.id);
        // const dataEdit = datas.filter((item) => item.id === role.id);
        // setDataTemp(data);
        console.log(data);
        let i;
        let newWeightRange = [];
        for (i = data.weightMin; i < data.weightMax; i = i + 0.5) {
            newWeightRange.push(i);
        }
        if (data.gender) {
            const newRange = weightRangeMale.filter((val) => !newWeightRange.includes(val));
            setWeightRangeTemp(newRange);
        } else {
            const newRange = weightRangeFemale.filter((val) => !newWeightRange.includes(val));
            console.log(newRange, weightRangeFemale);
            setWeightRangeTemp(newRange);
        }
        setCompetitive(data);
        setEditDialogOpen(true);
    };

    const handleDelete = (params) => {
        setOpenConfirm(true);
        setCompetitive(params);
    };

    const handleCloseConfirm = () => {
        setCompetitive();
        setOpenConfirm(false);
    };

    const handleOpenConfirm = () => {
        deleteCompetitive(competitive);
        const newRules = datas.filter((r) => {
            return r.id !== competitive.id;
        });
        setDatas(newRules);
        setCompetitive();
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
            {datas && competitive && (
                <EditCompetitiveTournament
                    isOpen={editDialogOpen}
                    competitive={competitive}
                    handleClose={() => {
                        setCompetitive();
                        setEditDialogOpen(false);
                    }}
                    onSucess={() => {
                        setCompetitive();
                        setIsRender(true);
                        setEditDialogOpen(false);
                    }}
                    data={datas}
                    weightRange={weightRangeTemp}
                />
            )}
            {datas && (
                <CreateCompetitiveTournament
                    isOpen={createDialogOpen}
                    handleClose={() => {
                        setCreateDialogOpen(false);
                    }}
                    onSucess={() => {
                        setIsRender(true);
                        setCreateDialogOpen(false);
                    }}
                    data={datas}
                />
            )}
            {competitive && (
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
                        Bạn có chắc chắn muốn xóa hạng cân{' '}
                        <strong>
                            {competitive.gender ? 'Nam' : 'Nữ'}: {competitive.weightMin} - {competitive.weightMax}
                        </strong>{' '}
                        này?
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
                    Thêm hạng cân thi đấu
                </Button>
            </DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        '& .MuiTextField-root': { mb: 2 },
                    }}
                >
                    <Box>
                        {datas && datas.length > 0 && (
                            <TableContainer sx={{ maxHeight: 350, m: 1, mr: 0, p: 1, mb: 2 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <caption style={{ captionSide: 'top' }}>
                                        Số lượng hạng cân thi đấu hiện tại : {datas.length}
                                    </caption>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Giới tính</TableCell>
                                            <TableCell align="center">Hạng cân</TableCell>
                                            <TableCell align="center"></TableCell>
                                            <TableCell align="center"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {datas.map((data) => (
                                            <TableRow key={data.id}>
                                                <TableCell align="center">{data.gender ? 'Nam' : 'Nữ'}</TableCell>
                                                <TableCell align="center">
                                                    {data.weightMin} - {data.weightMax} Kg
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        aria-label="edit"
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

export default CompetitiveSetting;
