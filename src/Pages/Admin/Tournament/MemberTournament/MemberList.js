import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import {
    Delete,
    Edit,
    FirstPage,
    KeyboardArrowDown,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    KeyboardArrowUp,
    LastPage,
    SportsScore,
} from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Collapse,
    Typography,
    TableFooter,
    TablePagination,
    useTheme,
} from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import adminTournament from 'src/api/adminTournamentAPI';
import UpdateExhibitionTeam from './UpdateExhibitionTeam';

function MemberList({ data, type, onChange, isUpdate, tournamentStatus, listExhibitionType, tournamentStage, user }) {
    const { enqueueSnackbar } = useSnackbar();
    const [pageSize, setPageSize] = useState(10);
    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [competitivePlayerId, setCompetitivePlayerId] = useState();
    const [openDialogExhibition, setOpenDialogExhibition] = useState(false);
    const [exhibitionTeam, setExhibitionTeam] = useState();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {}, [data]);

    let columns;
    let rowsPlayer;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const deleteCompetitivePlayer = async (competitivePlayerId) => {
        try {
            const response = await adminTournament.deleteCompetitivePlayer(competitivePlayerId, user.studentId);
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
        deleteCompetitivePlayer(competitivePlayerId.id);
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

    const handleClickUpdate = (data) => {
        const male = data.exhibitionPlayersDto.filter((player) => player.playerGender === true);
        const female = data.exhibitionPlayersDto.filter((player) => player.playerGender === false);
        const newData = {
            ...data,
            numberMale: listExhibitionType.find((exhibition) => exhibition.id === data.exhibitionTypeId).numberMale,
            numberFemale: listExhibitionType.find((exhibition) => exhibition.id === data.exhibitionTypeId).numberFemale,
            dataMale: male.map((m) => {
                return { name: m.playerName, gender: m.playerGender, studentId: m.playerStudentId };
            }),
            dataFemale: female.map((m) => {
                return { name: m.playerName, gender: m.playerGender, studentId: m.playerStudentId };
            }),
        };
        setExhibitionTeam(newData);
        setOpenDialogExhibition(true);
    };

    const handleClickCloseUpdate = (data) => {
        setExhibitionTeam();
        setOpenDialogExhibition(false);
    };

    const onSubmit = (value) => {
        updateWeightForCompetitivePlayer(competitivePlayerId.id, value.weight);
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
            { field: 'studentName', headerName: 'Tên', flex: 1 },
            {
                field: 'studentId',
                headerName: 'Mã sinh viên',
                width: 150,
                flex: 0.6,
            },
            { field: 'playerGender', headerName: 'Giới tính', width: 150, flex: 0.5 },
            { field: 'weight', headerName: 'Cân nặng', width: 150, flex: 0.8 },
            { field: 'isEligible', headerName: 'Điều kiện cân nặng', width: 150, flex: 1 },
            { field: 'weightRange', headerName: 'Hạng cân thi đấu', width: 150, flex: 0.5 },
            {
                field: 'actions',
                type: 'actions',
                flex: 0.8,
                getActions: (params) => [
                    <Tooltip title={!isUpdate && tournamentStage < 2 ? 'Cập nhật cân nặng' : 'Quá thời gian cập nhật'}>
                        <GridActionsCellItem
                            icon={<Edit />}
                            label="Edit weight"
                            onClick={() => updateWeight(params.row)}
                            // showInMenu
                            disabled={isUpdate || tournamentStage >= 2}
                        />
                    </Tooltip>,
                    <Tooltip
                        title={
                            !isUpdate && tournamentStatus < 1
                                ? 'Xóa người vận động viên khỏi bảng đấu'
                                : 'Quá thời gian cập nhật'
                        }
                    >
                        <GridActionsCellItem
                            icon={<Delete />}
                            label="Delete"
                            onClick={() => deleteUser(params.row)}
                            disabled={isUpdate || tournamentStage >= 1}
                        />
                    </Tooltip>,
                ],
            },
        ];

        rowsPlayer =
            data &&
            data.map((item, index) => {
                const container = {};
                container['id'] = item.id;
                container['studentName'] = item.tournamentPlayer.user.name;
                container['weight'] = item.weight == 0 ? 'Chưa cập nhật cân nặng' : item.weight + 'Kg';
                container['isEligible'] = item.isEligible ? 'Đạt tiêu chuẩn' : 'Không đạt tiêu chuẩn';
                container['studentId'] = item.tournamentPlayer.user.studentId;
                container['playerGender'] = item.tournamentPlayer.user.gender ? 'Nam' : 'Nữ';
                container['weightRange'] =
                    item.competitiveType.weightMin + ' - ' + item.competitiveType.weightMax + 'Kg';
                return container;
            });
    }

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
                    <Typography>
                        Số lượng vận động viên: {data.length} <small>(cần tối thiểu 4 người)</small>
                    </Typography>
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
        mode: 'onChange',
    });

    function Row(props) {
        const { row, status, stage, index } = props;
        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? (
                                <Tooltip title="Đóng" arrow>
                                    <KeyboardArrowUp />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Thành viên trong đội" arrow>
                                    <KeyboardArrowDown />
                                </Tooltip>
                            )}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {index + 1}
                    </TableCell>
                    <TableCell align="left">{row.teamName}</TableCell>
                    <TableCell align="left">{row.exhibitionTypeName}</TableCell>
                    {stage < 1 && (
                        <TableCell align="left">
                            <Tooltip title="Chỉnh sửa thông tin đội tham gia">
                                <Chip
                                    icon={<Edit />}
                                    // clickable={row.score == null ? true : false}
                                    onClick={() => handleClickUpdate(row)}
                                />
                            </Tooltip>
                        </TableCell>
                    )}
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Thành viên
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tên thành viên</TableCell>
                                            <TableCell>Mã số sinh viên</TableCell>
                                            <TableCell align="left">Giới tính</TableCell>
                                            <TableCell align="left">Vai trò</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.exhibitionPlayersDto.map((player) => (
                                            <TableRow key={player.id}>
                                                <TableCell component="th" scope="row">
                                                    {player.playerName}
                                                </TableCell>
                                                <TableCell>{player.playerStudentId}</TableCell>
                                                <TableCell align="left">{player.playerGender ? 'Nam' : 'Nữ'}</TableCell>
                                                <TableCell align="left">
                                                    {player.roleInTeam ? 'Trưởng nhóm' : ''}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '70vh',
                width: '100%',
            }}
        >
            {type === 1 ? (
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
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="caption table">
                        <caption>
                            <Typography>
                                Số lượng đội thi đấu: {data.length} <small>(cần tối thiểu 3 đội)</small>
                            </Typography>
                        </caption>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>STT</TableCell>
                                <TableCell align="left">Tên đội</TableCell>
                                {/* <TableCell align="left">Thời gian thi đấu</TableCell> */}
                                <TableCell align="left">Nội dung thi đấu</TableCell>
                                {/* {params.status === 2 && <TableCell align="left"></TableCell>} */}
                                {tournamentStatus === 3 && <TableCell align="left"></TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : data
                            ).map((row, index) => (
                                <Row
                                    key={row.id}
                                    row={row}
                                    status={tournamentStatus}
                                    stage={tournamentStage}
                                    index={index}
                                />
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    // colSpan={3}
                                    count={data.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'Số lượng đội hiển thị',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            )}
            {competitivePlayerId && (
                <Dialog
                    // fullWidth
                    // maxWidth="md"
                    open={openDelete}
                    onClose={handleCloseDelete}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Xác nhận</DialogTitle>
                    <DialogContent>
                        Bạn có chắc chắn muốn xóa vận động viên{' '}
                        <strong>
                            {competitivePlayerId.studentName} - {competitivePlayerId.studentId}
                        </strong>{' '}
                        ra khỏi thể thức thi đấu này không
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={handleCloseDelete}>
                            Hủy
                        </Button>
                        <Button variant="contained" onClick={handleConfirmDelete} autoFocus>
                            Xác nhận
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {competitivePlayerId && (
                <Dialog
                    // fullWidth
                    // maxWidth="md"
                    open={openUpdate}
                    onClose={handleCloseUpdate}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Chỉnh sửa cân nặng cho vận động viên{' '}
                        <strong>
                            {competitivePlayerId.studentName} - {competitivePlayerId.studentId}
                        </strong>
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
                        <Button variant="outlined" onClick={handleCloseUpdate}>
                            Hủy
                        </Button>
                        <Button variant="contained" onClick={handleSubmit(onSubmit)} autoFocus>
                            Xác nhận
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {exhibitionTeam && (
                <UpdateExhibitionTeam
                    title="Chỉnh sửa đội biểu diễn"
                    isOpen={openDialogExhibition}
                    exhibitionTeam={exhibitionTeam}
                    user={user}
                    handleClose={() => {
                        handleClickCloseUpdate(false);
                    }}
                    onSuccess={() => {
                        // fetchExhibitionTeam(tournamentId, exhibitionType);
                        handleClickCloseUpdate(false);
                    }}
                    onChangeData={() => {
                        onChange && onChange();
                    }}
                />
            )}
        </Box>
    );
}
function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
            </IconButton>
        </Box>
    );
}

export default MemberList;
