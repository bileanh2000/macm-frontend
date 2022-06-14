import React, { useEffect, useState } from 'react'
import { Visibility, VisibilityOff, Edit, Delete } from '@mui/icons-material';
import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, TablePagination, Snackbar, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import adminNewsAPI from 'src/api/adminNewsAPI';
import DialogCommon from "src/Components/Dialog/Dialog";


function NewsList() {

    const [newsList, setNews] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const history = useNavigate()
    const location = useLocation();
    const _openSnackBar = location.state?.isSuccess == null ? false : true
    const _isSuccess = location.state?.isSuccess == null ? true : location.state?.isSuccess
    const _message = location.state?.message == null ? "" : location.state?.message
    const [success, setSuccess] = useState({ isSuccess: _isSuccess, message: _message })
    const [openSnackBar, setOpenSnackBar] = useState(_openSnackBar);
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
            handleDeleteNews(dialog.params)
            setSuccess({ isSuccess: true, message: "Xóa news thành công" })
            setOpenSnackBar(true)
            handleDialog("", false, -1);
        } else {
            console.log(dialog);
            handleDialog("", false, -1);
        }
    };

    const fetchNewsList = async () => {
        try {
            const response = await adminNewsAPI.getNews()
            console.log(response);
            setNews(response.data)
        } catch (error) {
            console.log('Lấy dữ liệu news thất bại')
        }
    }

    useEffect(() => {
        fetchNewsList()
    }, [])

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleDeleteNews = async (id) => {
        try {
            await adminNewsAPI.deleteNews(id)
            const newNews = newsList.filter((news) => {
                return news.id !== id;
            });
            setNews(newNews)
            setSuccess({ isSuccess: true, message: "Xóa news thành công" })
        } catch (error) {
            setSuccess({ isSuccess: false, message: "Xóa news thất bại" })
        }
        setOpenSnackBar(true)
    }

    const handleDelete = params => {
        handleDialog("Bạn có chắc chắn muốn xóa không?", true, params);
    }

    const handleUpdateStatusNews = async (news) => {
        try {
            await adminNewsAPI.updateStatusNews({ ...news, status: !news.status })
            const newNews = newsList.map((_news) => {
                return _news.id == news.id ? { ..._news, status: !_news.status } : _news
            });
            setNews(newNews)
            setSuccess({ isSuccess: true, message: "Cập nhật trạng thái news thành công" })
        } catch (error) {
            setSuccess({ isSuccess: false, message: "Cập nhật trạng thái news thất bại" })
        }
        setOpenSnackBar(true)
    }

    const handleCloseSnackBar = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    }

    return (
        <div>
            <div>
                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={5000}
                    onClose={handleCloseSnackBar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: '100%' }}>
                        {success.message}
                    </Alert>
                </Snackbar>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    {newsList.length > 0 && (<TableBody>
                        {newsList.map((news, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row"
                                    onClick={() => history({
                                        pathname: `/admin/news/${news.id}`
                                    }, { state: { news: news } })}>
                                    {news.title}
                                </TableCell>
                                <TableCell align="right">{news.time}</TableCell>
                                <TableCell align="right" onClick={() => handleUpdateStatusNews(news)}>
                                    {news.status === true ? <Visibility /> : <VisibilityOff />}
                                </TableCell>
                                <TableCell align="right" onClick={() => history({
                                    pathname: `/admin/news/${news.id}/edit`
                                }, { state: { news: news } })}>
                                    <Edit />
                                </TableCell>
                                <TableCell align="right" onClick={() => handleDelete(news.id)}>
                                    <Delete />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    )}
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={newsList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {dialog.isLoading && (
                <DialogCommon
                    //Update
                    onDialog={areUSureDelete}
                    message={dialog.message}
                    id={dialog.params}
                />
            )}
        </div>

    )
}

export default NewsList 