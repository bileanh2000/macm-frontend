import { ModeEditOutline, DeleteForeverOutlined } from "@mui/icons-material";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Pagination, Snackbar, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import adminRuleAPI from 'src/api/adminRuleAPI'
import styles from './ListRule.module.scss'
import DialogCommon from "src/Components/Dialog/Dialog";

const cx = classNames.bind(styles)

function List() {
    const location = useLocation();
    const _openSnackBar = location.state?.isSuccess == null ? false : true
    const _isSuccess = location.state?.isSuccess == null ? true : location.state?.isSuccess
    const _message = location.state?.message == null ? "" : location.state?.message
    const [success, setSuccess] = useState({ isSuccess: _isSuccess, message: _message })
    const [openSnackBar, setOpenSnackBar] = useState(_openSnackBar);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0)
    const [rules, setRules] = useState([]);
    const [pageSize, setPageSize] = useState(10)
    const [dialog, setDialog] = useState({
        message: "",
        isLoading: false,
        params: -1
    });
    const handleDialog = (message, isLoading, params) => {
        setDialog({
            message,
            isLoading,
            params
        });
    };
    const areUSureDelete = (choose) => {
        if (choose) {
            deleteRule(dialog.params)
            setSuccess({ isSuccess: true, message: "Xóa rule thành công" })
            setOpenSnackBar(true)
            const newRules = rules.filter((rule) => {
                return rule.id !== dialog.params;
            });
            setRules(newRules)
            handleDialog("", false, -1);
        } else {
            console.log(dialog);
            handleDialog("", false, -1);
        }
    };

    const handleChange = (event, value) => {
        setPage(value);
    };

    const getListRules = async (pageNo) => {
        try {
            const response = await adminRuleAPI.getAll(pageNo)
            setRules(response.data)
            setTotal(response.totalPage)
            setPageSize(response.pageSize)
        } catch (error) {
            console.log("Lấy dữ liệu rule thất bại", error);
        }
    }
    console.log(rules)

    useEffect(() => {
        getListRules(page - 1)
        window.scrollTo({ behavior: 'smooth', top: '0px' })
    }, [page])

    const deleteRule = async (id) => {
        try {
            await adminRuleAPI.delete(id)
        } catch (error) {
            console.log("Xóa rule thất bại", error);
        }
    }



    const handleDelete = params => {
        handleDialog("Bạn có chắc chắn muốn xóa không?", true, params);
    }

    const handleCloseSnackBar = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    }

    return (
        <div className={cx('rule-container')}>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={3000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: '100%' }}>
                    {success.message}
                </Alert>
            </Snackbar>

            {
                rules.map((row, index) => (
                    <div className={cx('rule-item')} key={index}>
                        <Grid container spacing={2} style={{ alignItems: "center", marginTop: 1 }}>
                            <Grid item xs={1}>
                                {(page - 1) * pageSize + index + 1}
                            </Grid>
                            <Grid item xs={9}>
                                {row.description}
                            </Grid>
                            <Grid item xs={1}>
                                <Link to={{ pathname: './edit' }}
                                    state={
                                        {
                                            rule: row
                                        }
                                    }
                                >
                                    <ModeEditOutline color="primary" />
                                </Link>
                            </Grid>
                            <Grid item xs={1} onClick={() => handleDelete(row.id)}>
                                <DeleteForeverOutlined color="primary" />
                            </Grid>
                        </Grid>
                    </div>))
            }
            {total > 1 && (
                <Stack spacing={2}>
                    <Pagination count={total} page={page} onChange={handleChange} />
                </Stack>
            )}
            {dialog.isLoading && (
                <DialogCommon
                    //Update
                    onDialog={areUSureDelete}
                    message={dialog.message}
                    id={dialog.params}
                />
            )}
        </div >
    );
}

export default List;