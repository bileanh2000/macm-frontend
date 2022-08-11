import React, { useState } from 'react';
import { Box } from '@mui/system';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { Delete, Edit } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import adminTournament from 'src/api/adminTournamentAPI';

function MemberList({ data, type, onChange }) {
    const { enqueueSnackbar } = useSnackbar();
    const [pageSize, setPageSize] = useState(10);
    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [competitivePlayerId, setCompetitivePlayerId] = useState(0);

    let columns;
    let rowsPlayer;

    const deleteCompetitivePlayer = async (competitivePlayerId) => {
        try {
            const response = await adminTournament.deleteCompetitivePlayer(competitivePlayerId);
            onChange && onChange();
            enqueueSnackbar(response.message, {
                variant: response.message.includes('Không thể xóa') ? 'error' : 'success',
            });
        } catch (error) {
            console.warn('Failed to delete competitive player');
        }
    };

    const updateWeightForCompetitivePlayer = async (competitivePlayerId, weight) => {
        try {
            const response = await adminTournament.updateWeightForCompetitivePlayer(competitivePlayerId, weight);
            onChange && onChange();
            enqueueSnackbar(response.message, { variant: 'success' });
        } catch (error) {
            console.warn('Failed to delete competitive player');
        }
    };

    const deleteUser = (competitivePlayerId) => {
        setCompetitivePlayerId(competitivePlayerId);
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const handleConfirmDelete = () => {
        deleteCompetitivePlayer(competitivePlayerId);
        // const newData = data.filter((player) => player.id != competitivePlayerId);
        onChange && onChange();
        handleCloseDelete();
    };

    const updateWeight = (competitivePlayerId) => {
        setCompetitivePlayerId(competitivePlayerId);
        setOpenUpdate(true);
    };

    const handleCloseUpdate = () => {
        setOpenUpdate(false);
        reset({
            weight: '',
        });
    };

    const onSubmit = (value) => {
        updateWeightForCompetitivePlayer(competitivePlayerId, value.weight);
        // const newData = data.map((player) =>
        //     player.id === competitivePlayerId ? { ...player, weight: value.weight } : player,
        // );
        // console.log(newData);
        onChange && onChange();
        handleCloseUpdate();
    };

    if (type === 2) {
        columns = [
            { field: 'id', headerName: 'ID', flex: 0.8, hide: true },
            { field: 'teamName', headerName: 'Tên nhóm', flex: 0.8 },
            { field: 'playerName', headerName: 'Tên thành viên', flex: 0.8 },
            {
                field: 'studentId',
                headerName: 'Mã sinh viên',
                width: 150,
                flex: 0.6,
            },
            { field: 'playerGender', headerName: 'Giới tính', width: 150, flex: 1 },
            { field: 'role', headerName: 'Vai trò', width: 150, flex: 1 },
            { field: 'exhibitionTypeName', headerName: 'Nội dung biểu diến', width: 150, flex: 1 },
        ];

        const newRowsPlayer =
            data &&
            data.map((item, index) => {
                return item.exhibitionPlayersDto.map((i) => {
                    const container = {};
                    container['id'] = i.id;
                    container['teamName'] = item.teamName;
                    container['playerName'] = i.playerName;
                    container['studentId'] = i.playerStudentId;
                    container['playerGender'] = i.playerGender ? 'Nam' : 'Nữ';
                    container['role'] = i.roleInTeam ? 'Trưởng nhóm' : 'Thành viên';
                    container['exhibitionTypeName'] = item.exhibitionTypeName;
                    return container;
                });
            });
        rowsPlayer = [].concat(...newRowsPlayer);
    } else {
        columns = [
            { field: 'studentName', headerName: 'Tên', flex: 0.8 },
            {
                field: 'studentId',
                headerName: 'Mã sinh viên',
                width: 150,
                flex: 0.6,
            },
            { field: 'playerGender', headerName: 'Giới tính', width: 150, flex: 1 },
            { field: 'weight', headerName: 'Cân nặng', width: 150, flex: 1 },
            { field: 'weightRange', headerName: 'Hạng cân thi đấu', width: 150, flex: 1 },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit weight"
                        onClick={() => updateWeight(params.id)}
                        // showInMenu
                    />,
                    <GridActionsCellItem icon={<Delete />} label="Delete" onClick={() => deleteUser(params.id)} />,
                ],
            },
        ];

        rowsPlayer =
            data &&
            data.map((item, index) => {
                const container = {};
                container['id'] = item.id;
                container['studentName'] = item.tournamentPlayer.user.name;
                container['weight'] = item.weight + 'Kg';
                container['studentId'] = item.tournamentPlayer.user.studentId;
                container['playerGender'] = item.tournamentPlayer.user.gender ? 'Nam' : 'Nữ';
                container['weightRange'] =
                    item.competitiveType.weightMin + ' - ' + item.competitiveType.weightMax + 'Kg';
                return container;
            });
    }

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
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
                <Box sx={{ mt: 1 }}>No Rows</Box>
            </StyledGridOverlay>
        );
    }
    const validationSchema = Yup.object().shape({
        weight: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(39, 'Vui lòng nhập giá trị lớn hơn 39 Kg')
            .max(120, 'Vui lòng nhập giá trị cân nặng thực tế'),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setFocus,
        setError,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });
    return (
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
            <Dialog
                fullWidth
                maxWidth="md"
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    Xác nhận
                </DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn xóa vận động viên này</DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>Hủy</Button>
                    <Button onClick={handleConfirmDelete} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                fullWidth
                maxWidth="md"
                open={openUpdate}
                onClose={handleCloseUpdate}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    Chỉnh sửa cân nặng
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{
                            '& .MuiTextField-root': { mb: 2, mt: 2 },
                        }}
                    >
                        <TextField
                            type="number"
                            id="outlined-basic"
                            label="Vui lòng nhập hạng cân vận động viên"
                            variant="outlined"
                            fullWidth
                            {...register('weight')}
                            error={errors.weight ? true : false}
                            helperText={errors.weight?.message}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdate}>Hủy</Button>
                    <Button onClick={handleSubmit(onSubmit)} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
            <DataGrid
                // loading={data.length === 0}
                disableSelectionOnClick={true}
                rows={rowsPlayer}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 30]}
                components={{
                    Toolbar: CustomToolbar,
                    NoRowsOverlay: CustomNoRowsOverlay,
                }}
            />
        </Box>
    );
}

export default MemberList;
