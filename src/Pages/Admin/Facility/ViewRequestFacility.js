import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import facilityApi from 'src/api/facilityApi';

const ViewRequestFacility = ({ title, children, isOpen, handleClose, onSucess }) => {
    const [requestList, setRequestList] = useState([]);
    const [pageSize, setPageSize] = useState(30);

    const fetchRequestToBuyList = async () => {
        try {
            const response = await facilityApi.getAllRequest();
            console.log('fetch request to buy list', response.data);
            setRequestList(response.data);
        } catch (error) {
            console.log('failed when fetch request to buy list', error);
        }
    };

    useEffect(() => {
        fetchRequestToBuyList();
    }, []);

    const rowData = requestList.map((item, index) => {
        const container = {};
        container['id'] = index;
        container['createdOn'] = moment(item.createdOn).format('HH:mm - DD/MM/YYYY');
        container['facilityName'] = item.facilityName;
        container['facilityCategory'] = item.facilityCategory;
        container['quantity'] = item.quantity;
        container['unitPrice'] = item.unitPrice.toLocaleString('en-US') + ' VND';
        container['totalPrice'] = (item.quantity * item.unitPrice).toLocaleString('en-US') + ' VND';
        container['status'] = item.status;
        return container;
    });
    const columns = [
        { field: 'createdOn', headerName: 'Ngày giờ yêu cầu', flex: 1 },
        { field: 'facilityName', headerName: 'Tên', flex: 1 },
        { field: 'facilityCategory', headerName: 'Danh mục', flex: 1 },
        { field: 'quantity', headerName: 'Số lượng yêu cầu', flex: 1 },
        { field: 'unitPrice', headerName: 'Đơn giá', flex: 1 },
        { field: 'totalPrice', headerName: 'Thành tiền', flex: 1 },
        {
            field: 'status',
            headerName: 'Trạng thái',
            flex: 1,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('status-rows', {
                    accepted: params.value === 'Đã chấp nhận',
                    decline: params.value === 'Đã từ chối',
                    pending: params.value === 'Đang chờ duyệt',
                });
            },
        },
    ];
    function CustomToolbar() {
        return (
            <Fragment>
                <GridToolbarContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        {/* <GridToolbarColumnsButton /> */}
                        <GridToolbarQuickFilter />
                        {/* <GridToolbarFilterButton /> */}
                    </Box>

                    {/* </Box> */}
                </GridToolbarContainer>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Dialog
                fullWidth
                maxWidth="lg"
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            height: '70vh',
                            width: '100%',
                            '& .status-rows': {
                                // justifyContent: 'center !important',
                                // minHeight: '0px !important',
                                // maxHeight: '35px !important',
                                // borderRadius: '100px',
                                // position: 'relative',
                                // top: '9px',
                                // minWidth: '104.143px !important',
                            },
                            '& .status-rows.accepted': {
                                backgroundColor: '#56f000',
                                color: '#fff',
                                fontWeight: '600',
                                textAlign: 'center',
                            },
                            '& .status-rows.decline': {
                                backgroundColor: '#ff3838',
                                color: '#fff',
                                fontWeight: '600',
                            },
                            '& .status-rows.pending': {
                                backgroundColor: '#f0ad4e',
                                color: '#fff',
                                fontWeight: '600',
                            },
                        }}
                    >
                        <DataGrid
                            loading={!rowData}
                            disableSelectionOnClick={true}
                            rows={rowData}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                            rowsPerPageOptions={[30, 40, 50]}
                            // onCellDoubleClick={(param) => {
                            //     handleOnClick(param.row);
                            // }}
                            localeText={{
                                toolbarColumns: 'Cột',
                                toolbarFilters: 'Bộ lọc tìm kiếm',
                            }}
                            components={{
                                Toolbar: CustomToolbar,
                                // Pagination: CustomPagination,
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Quay lại</Button>
                    {/* <Button onClick={handleSubmit(onSubmit)} autoFocus>
                        Xác nhận
                    </Button> */}
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default ViewRequestFacility;
