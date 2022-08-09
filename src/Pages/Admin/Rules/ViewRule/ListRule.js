import { ModeEditOutline, DeleteForeverOutlined } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Pagination,
    Paper,
    Snackbar,
    Stack,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import adminRuleAPI from 'src/api/adminRuleAPI';

function List() {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [rules, setRules] = useState([]);
    const [rule, setRule] = useState();
    const { enqueueSnackbar } = useSnackbar();
    const [pageSize, setPageSize] = useState(10);

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
        handleCloseConfirm();
    };

    const handleChange = (event, value) => {
        setPage(value);
    };

    const getListRules = async (pageNo) => {
        try {
            const response = await adminRuleAPI.getAll(pageNo);
            setRules(response.data);
            setTotal(response.totalPage);
            setPageSize(response.pageSize);
        } catch (error) {
            console.log('Lấy dữ liệu rule thất bại', error);
        }
    };
    console.log(rules);

    useEffect(() => {
        getListRules(page - 1);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [page]);

    const deleteRule = async (id) => {
        try {
            const response = await adminRuleAPI.delete(id);
            enqueueSnackbar(response.message, { variant: 'success' });
        } catch (error) {
            console.log('Xóa rule thất bại', error);
        }
    };

    const handleDelete = (params) => {
        setOpenConfirm(true);
        setRule(params);
    };

    return (
        <Box>
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
                <DialogContent>Bạn có chắc chắn muốn cập nhật trạng thái đóng tiền</DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm}>Hủy</Button>
                    <Button onClick={handleOpenConfirm} autoFocus>
                        Đồng ý
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
                            <Link
                                to={{ pathname: './edit' }}
                                state={{
                                    rule: row,
                                }}
                            >
                                <ModeEditOutline color="primary" />
                            </Link>
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
    );
}

export default List;
