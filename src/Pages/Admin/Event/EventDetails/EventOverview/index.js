import React, { Fragment, useState } from 'react';
import {
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { Edit } from '@mui/icons-material';
import UpdateTournamentOverview from './UpdateEventOverview';

function TournamentOverview({ tournament, onUpdateTournament, value, index, startTime, isUpdate }) {
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        // [`&.${tableCellClasses.head}`]: {
        //     backgroundColor: theme.palette.common.black,
        //     color: theme.palette.common.white,
        // },
        // [`&.${tableCellClasses.body}`]: {
        //     fontSize: 14,
        // },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {tournament && (
                <Fragment>
                    <Grid container columns={12} sx={{ mt: 2 }} spacing={2}>
                        <Grid item xs={7}>
                            <Typography variant="body1" sx={{}}>
                                <strong>Nội dung: </strong>
                                {tournament.description}
                            </Typography>
                            <Typography variant="body1" sx={{}}>
                                <strong>Nội dung: </strong>
                                {tournament.description}
                            </Typography>
                            <Typography variant="body1" sx={{}}>
                                <strong>Nội dung: </strong>
                                {tournament.description}
                            </Typography>
                            <Typography variant="body1" sx={{}}>
                                <strong>Nội dung: </strong>
                                {tournament.description}
                            </Typography>
                            <Typography variant="body1" sx={{}}>
                                <strong>Nội dung: </strong>
                                {tournament.description}
                            </Typography>
                            {/* <Typography variant="body1" sx={{ p: 2, m: 1 }}>
                                <strong>Hạng mục thi đấu:</strong>
                            </Typography> */}
                        </Grid>
                        <Grid item xs={5}>
                            {!isUpdate && (
                                <Button
                                    variant="outlined"
                                    startIcon={<Edit />}
                                    sx={{ float: 'right' }}
                                    onClick={() => setOpenEditDialog(true)}
                                >
                                    Chỉnh sửa
                                </Button>
                            )}
                            {openEditDialog && (
                                <UpdateTournamentOverview
                                    // DialogOpen={true}
                                    data={tournament}
                                    title="Cập nhật thông tin giải đấu"
                                    isOpen={openEditDialog}
                                    handleClose={() => {
                                        setOpenEditDialog(false);
                                        // reload();
                                    }}
                                    onSuccess={(newItem) => {
                                        onUpdateTournament(newItem);
                                        setOpenEditDialog(false);
                                    }}
                                    startTime={startTime}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Fragment>
            )}
        </div>
    );
}
export default TournamentOverview;
