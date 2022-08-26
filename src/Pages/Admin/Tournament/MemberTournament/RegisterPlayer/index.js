import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import adminTournament from 'src/api/adminTournamentAPI';
import AddMember from './AddMember';
import { Delete } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';

function RegisterPlayer({ isOpen, handleClose, onSuccess, onChangeData, competitiveId, genderCompetitive }) {
    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [player, setPlayer] = useState([]);
    const [weightRange, setWeightRange] = useState(competitiveId);
    const [gender, setGender] = useState(genderCompetitive);
    const [listWeightRange, setListWeightRange] = useState([]);
    const [minWeight, setMinWeight] = useState();
    const [maxWeight, setMaxWeight] = useState();
    const [allMember, setAllMember] = useState();
    const [isRender, setIsRender] = useState(true);
    const [pageSize, setPageSize] = useState(30);
    // const [selectedRows, setSelectedRows] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);

    const AddPlayerHandler = (data) => {
        setPlayer(data);
    };
    const handleChangeWeight = (event) => {
        setWeightRange(event.target.value);
        setPlayer([]);
        let range;
        if (event.target.value === 0) {
            range = { weightMax: 0, weightMin: 0 };
        } else {
            range = listWeightRange.find((weight) => weight.id === event.target.value);
            setGender(range.gender);
            setMinWeight(range.weightMin);
            setMaxWeight(range.weightMax);
        }
        getAllMember(event.target.value);
    };

    const getAllMember = async (weightRange) => {
        try {
            const response = await adminTournament.listUserNotJoinCompetitive(weightRange);
            console.log(response.data);
            setAllMember(response.data);
            // setIsRender(true);
        } catch (error) {
            console.log('khong the lay data');
        }
    };

    const addNewCompetitivePlayer = async (studentId, users) => {
        try {
            const response = await adminTournament.addNewCompetitivePlayer(studentId, users);
            let variant = response.data.length > 0 ? 'success' : 'error';
            enqueueSnackbar(response.message, { variant });
            onChangeData && onChangeData();
            setIsRender(true);
        } catch (error) {
            let variant = 'error';
            enqueueSnackbar(error, { variant });
        }
    };

    const handleDelete = (data) => {
        let newData;
        newData = player.filter((d) => {
            return d.studentId !== data.studentId;
        });
        setPlayer(newData);
    };

    const handleCloseDialog = () => {
        setPlayer([]);
        // reset({
        //     weight: '',
        // });
        handleClose && handleClose();
    };

    const handleRegister = (data) => {
        // const params = { userId: player[0].id, competitiveTypeId: weightRange, weight: data.weight, tournamentId };
        if (player.length === 0) {
            let variant = 'error';
            enqueueSnackbar('Vui lòng chọn thông tin vận động viên', { variant });
            return;
        }
        addNewCompetitivePlayer(weightRange, player);
        const newPlayer = player.map((p) => {
            return {
                id: p.id,
                tournamentPlayer: { user: { gender: p.gender, name: p.name, studentId: p.studentId } },
                weight: 0,
                competitiveType: { weightMax: maxWeight, weightMin: minWeight },
            };
        });
        onSuccess && onSuccess(newPlayer);
        setPlayer([]);
        // reset({
        //     weight: '',
        // });
        handleClose && handleClose();
    };

    useEffect(() => {
        setGender(genderCompetitive);
        setIsRender(true);
    }, [genderCompetitive]);

    useEffect(() => {
        setWeightRange(competitiveId);
        getAllMember(competitiveId);
        setIsRender(true);
    }, [competitiveId]);

    useEffect(() => {
        const fetchCompetitiveType = async (tournamentId) => {
            try {
                const response = await adminTournament.getAllCompetitiveType(tournamentId);
                setListWeightRange(response.data[0]);
                // setWeightRange(response.data[0][0].id);
                gender == null && setGender(response.data[0][0].gender);
                setMinWeight(response.data[0][0].weightMin);
                setMaxWeight(response.data[0][0].weightMax);
            } catch (error) {
                console.log('Failed to fetch user list: ', error);
            }
        };
        fetchCompetitiveType(tournamentId);
    }, [tournamentId, gender]);

    useEffect(() => {
        isRender && getAllMember(weightRange);
        setIsRender(false);
    }, [weightRange, allMember, isRender]);

    const columns = [
        { field: 'studentName', headerName: 'Tên', flex: 1 },

        {
            field: 'studentId',
            headerName: 'Mã sinh viên',
            width: 150,
            flex: 0.6,
        },
        { field: 'generation', headerName: 'Gen', flex: 0.5 },
        { field: 'gender', headerName: 'Giới tính', width: 150, flex: 0.5 },
    ];

    const rowsUser =
        allMember &&
        allMember
            .filter((member) => member.gender === gender)
            .map((item, index) => {
                const container = {};
                container['id'] = item.id;
                container['studentName'] = item.name;
                container['generation'] = item.generation;
                container['studentId'] = item.studentId;
                container['gender'] = item.gender ? 'Nam' : 'Nữ';
                // container['paymentStatus'] = item.paymentStatus ? 'Đã đóng' : 'Chưa đóng';
                return container;
            });

    return (
        <Dialog
            open={!!isOpen}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Thêm vận động viên viên vào thi đấu đối kháng</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: 2 }}>
                    {/* {allMember && (
                        <AddMember
                            data={player}
                            onAddPlayer={AddPlayerHandler}
                            allMember={allMember.filter((member) => member.gender === gender)}
                        />
                    )} */}
                    <FormControl size="small">
                        <Typography variant="caption">{gender ? 'Nam' : 'Nu'}</Typography>
                        <Select id="demo-simple-select" value={weightRange} displayEmpty onChange={handleChangeWeight}>
                            {listWeightRange &&
                                listWeightRange.map((range) => (
                                    <MenuItem value={range.id} key={range.id}>
                                        {range.gender ? 'Nam: ' : 'Nữ: '} {range.weightMin} - {range.weightMax} Kg
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ width: '100%', minHeight: 400 }}>
                            {player.length > 0 && (
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                         <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Mã sinh viên</TableCell>
                                                <TableCell align="center">Tên sinh viên</TableCell>
                                                <TableCell align="center">Giới tính</TableCell>
                                                <TableCell align="center"></TableCell>
                                            </TableRow>
                                        </TableHead> 
                                        <TableBody>
                                            {player.map((data, index) => (
                                                <TableRow key={index}>
                                                    <TableCell align="center">{data.studentId}</TableCell>
                                                    <TableCell align="center">{data.name}</TableCell>
                                                    <TableCell align="center">{data.gender ? 'Nam' : 'Nữ'}</TableCell>
                                                    <TableCell align="center">
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
                        </Paper>
                    </Grid>
                </Grid> */}
                <Box sx={{ height: '400px' }}>
                    {rowsUser && (
                        <DataGrid
                            rows={rowsUser}
                            checkboxSelection
                            onSelectionModelChange={(ids) => {
                                setSelectionModel(ids);
                                const selectedIDs = new Set(ids);
                                const selectedRows = allMember && allMember.filter((row) => selectedIDs.has(row.id));
                                setPlayer(selectedRows);
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
                        />
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleCloseDialog}>
                    Hủy
                </Button>
                <Button variant="contained" onClick={handleRegister} autoFocus disabled={selectionModel.length == 0}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
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
            <Box sx={{ mt: 1 }}>Danh sách trống</Box>
        </StyledGridOverlay>
    );
}

export default RegisterPlayer;
