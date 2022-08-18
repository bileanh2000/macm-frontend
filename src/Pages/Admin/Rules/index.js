import { useEffect, useState } from 'react';
import { ModeEditOutline, DeleteForeverOutlined, AddCircle } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Pagination,
    Paper,
    Snackbar,
    Stack,
    Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { Link, Navigate, useLocation } from 'react-router-dom';

import adminRuleAPI from 'src/api/adminRuleAPI';
import CreateRule from './CreateRule/CreateRule';
import EditRule from './EditRule/EditRule';

import { IfAnyGranted } from 'react-authorization';

function Rules() {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [rules, setRules] = useState([]);
    const [rule, setRule] = useState();
    const { enqueueSnackbar } = useSnackbar();
    const [pageSize, setPageSize] = useState(10);
    const [isRender, setIsRender] = useState(true);

    const handleCloseConfirm = () => {
        setRule();
        setOpenConfirm(false);
    };

    const handleOpenConfirm = () => {
        deleteRule(rule);
        const newRules = rules.filter((r) => {
            return r.id !== rule;
        });
        setRules(newRules);
        setRule();
        handleCloseConfirm();
    };

    const handleChange = (event, value) => {
        setPage(value);
        setIsRender(true);
    };

    const getListRules = async (pageNo) => {
        try {
            const response = await adminRuleAPI.getAll(pageNo);
            setRules(response.data);
            setTotal(response.totalPage);
            setPageSize(response.pageSize);
            setIsRender(false);
        } catch (error) {
            console.log('Lấy dữ liệu rule thất bại', error);
        }
    };
    console.log(rules);

    useEffect(() => {
        isRender && getListRules(page - 1);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [page, isRender, rules]);

    const deleteRule = async (id) => {
        try {
            const response = await adminRuleAPI.delete(id);
            enqueueSnackbar(response.message, { variant: 'success' });
            setIsRender(true);
        } catch (error) {
            console.log('Xóa rule thất bại', error);
        }
    };

    const handleEdit = (params) => {
        setRule(params);
        setEditDialogOpen(true);
    };

    const handleDelete = (params) => {
        setOpenConfirm(true);
        setRule(params);
    };

    return (
        <IfAnyGranted
            expected={['ROLE_ViceHeadClub', 'ROLE_HeadClub', 'ROLE_HeadCulture', 'ROLE_ViceHeadCulture']}
            actual={JSON.parse(localStorage.getItem('currentUser')).role.name}
            unauthorized={<Navigate to="/forbidden" />}
        >
            <Box sx={{ m: 1, p: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500 }}>
                        Danh sách nội quy
                    </Typography>
                    <Button
                        variant="outlined"
                        sx={{ maxHeight: '50px', minHeight: '50px' }}
                        // component={Link}
                        // to={'./create'}
                        onClick={() => setCreateDialogOpen(true)}
                        startIcon={<AddCircle />}
                    >
                        Tạo nội quy mới
                    </Button>
                </Box>
                <Divider />
                <Box sx={{ m: 2 }}>
                    <Box>
                        <Dialog
                            fullWidth
                            maxWidth="md"
                            open={openConfirm}
                            onClose={handleCloseConfirm}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle
                                id="alert-dialog-title"
                                sx={{ display: 'flex', justifyContent: 'space-between' }}
                            >
                                Xác nhận
                            </DialogTitle>
                            <DialogContent>Bạn có chắc chắn muốn xóa nội quy này?</DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseConfirm}>Hủy</Button>
                                <Button onClick={handleOpenConfirm} autoFocus>
                                    Xác nhận
                                </Button>
                            </DialogActions>
                        </Dialog>
                        {rules.map((row, index) => (
                            <Paper elevation={1} key={index} sx={{ minHeight: 10, p: 2, m: 2 }}>
                                <Grid container spacing={2} sx={{ m: 0, alignItems: 'center' }}>
                                    <Grid item xs={1}>
                                        {(page - 1) * pageSize + index + 1}
                                    </Grid>
                                    <Grid item xs={9}>
                                        {row.description}
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton onClick={() => handleEdit(row)}>
                                            <ModeEditOutline color="primary" />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={1} onClick={() => handleDelete(row.id)}>
                                        <DeleteForeverOutlined color="primary" />
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))}
                        {total > 1 && (
                            <Stack spacing={2}>
                                <Pagination count={total} page={page} onChange={handleChange} />
                            </Stack>
                        )}
                    </Box>
                    <CreateRule
                        isOpen={createDialogOpen}
                        handleClose={() => {
                            // setIsOpenEditSessionDialog(false);
                            // setSelectedDate(null);
                            setCreateDialogOpen(false);
                        }}
                        onSucess={() => {
                            setPage(1);
                            setIsRender(true);
                        }}
                    />
                    {rule && (
                        <EditRule
                            isOpen={editDialogOpen}
                            rule={rule}
                            handleClose={() => {
                                // setIsOpenEditSessionDialog(false);
                                // setSelectedDate(null);
                                setEditDialogOpen(false);
                            }}
                            onSucess={() => {
                                setPage(1);
                                setIsRender(true);
                            }}
                        />
                    )}
                </Box>
            </Box>
        </IfAnyGranted>
    );
}

export default Rules;
