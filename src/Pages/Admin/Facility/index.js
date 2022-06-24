import { Box } from '@mui/system';
import { Fragment, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Button, MenuItem, TextField } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import facilityApi from 'src/api/facilityApi';
import { useEffect } from 'react';
import FacilityDialog from './FacilityDialog';

function Facility() {
    const [category, setCategory] = useState(1);
    const [facilityList, setFacilityList] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState(false);
    const [isOpenDialog, setIsOpenDialog] = useState(false);

    const handleOpen = () => {
        setIsOpenDialog(true);
    };
    const handleClose = () => {
        setIsOpenDialog(false);
    };
    const handleDialogOpen = () => {
        setOpen(true);
    };
    const handleDialogClose = () => {
        setOpen(false);
    };
    const handleChangeCategory = (event) => {
        setCategory(event.target.value);
    };
    const fetchFacility = async () => {
        try {
            const response = await facilityApi.getAll();
            console.log(response.data);
            setFacilityList(response.data);
        } catch (error) {
            console.log('fetch facility failed', error);
        }
    };

    useEffect(() => {
        fetchFacility();
    }, []);

    const rowData = facilityList.map((item, index) => {
        const container = {};
        container['id'] = index;
        container['facilityId'] = item.facilityId;
        container['facilityName'] = item.facilityName;
        container['facilityCategoryName'] = item.facilityCategoryName;
        container['quantityUsable'] = item.quantityUsable;
        container['quantityBroken'] = item.quantityBroken;
        container['total'] = item.quantityBroken + item.quantityUsable;

        return container;
    });

    useEffect(() => {
        console.log(rowData);
    }, []);

    const columns = [
        { field: 'facilityId', headerName: 'Id', flex: 1, hide: true },
        { field: 'facilityName', headerName: 'Tên', flex: 1 },

        { field: 'facilityCategoryName', headerName: 'Loại', flex: 1 },
        { field: 'quantityUsable', headerName: 'Sử dụng được', flex: 1 },
        { field: 'quantityBroken', headerName: 'Đã hỏng', flex: 1 },
        { field: 'total', headerName: 'Tổng số lượng', flex: 1 },
        {
            field: 'actions',
            type: 'actions',
            flex: 0.5,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Chỉnh sửa"
                    // onClick={editUser(params.row.studentId)}
                />,
            ],
        },
    ];
    function CustomToolbar() {
        return (
            <Fragment>
                <GridToolbarContainer>
                    <Box>
                        <GridToolbarColumnsButton />
                        <GridToolbarFilterButton />
                    </Box>
                    {/* <Typography variant="button" color="initial" sx={{ marginLeft: 'auto', marginRight: '1rem' }}>
                        Tổng thành viên Active: {countActive}/{userList.length}
                    </Typography> */}
                </GridToolbarContainer>
                {/* <Box>
                </Box> */}
            </Fragment>
        );
    }
    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" color="initial" sx={{ fontWeight: 500 }}>
                    Quản lý cơ sở vật chất
                </Typography>

                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<CurrencyExchangeIcon />}
                        sx={{ ml: 1 }}
                        onClick={handleDialogOpen}
                    >
                        Đề xuất mua cơ sở vật chất
                    </Button>
                    <FacilityDialog button="hehe" title="tieeu dde" content="noi dung" />
                    <Button variant="outlined" startIcon={<AddCircleIcon />} sx={{ ml: 1 }}>
                        Thêm cơ sở vật chất
                    </Button>
                    <Button variant="outlined" startIcon={<EditIcon />} sx={{ ml: 1 }}>
                        Chỉnh sửa loại
                    </Button>
                </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
                <TextField
                    id="outlined-select-currency"
                    size="small"
                    select
                    label="Chọn kỳ"
                    value={category}
                    onChange={handleChangeCategory}
                >
                    <MenuItem value={1}>Áo chống đạn</MenuItem>
                    <MenuItem value={2}>Súng trường</MenuItem>
                    <MenuItem value={3}>Súng lục</MenuItem>
                    <MenuItem value={4}>Cận chiến</MenuItem>
                </TextField>
            </Box>
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
                        minWidth: '104.143px !important',
                    },
                    '& .status-rows.active': {
                        backgroundColor: '#56f000',
                        color: '#fff',
                        fontWeight: '600',
                        textAlign: 'center',
                    },
                    '& .status-rows.deactive': {
                        backgroundColor: '#ff3838',
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
                    rowsPerPageOptions={[10, 20, 30]}
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
            <FacilityDialog
                // DialogOpen={true}
                title="Đề xuất mua cơ sở vật chất"
                children="đây là nội dung"
                isOpen={open}
                handleClose={handleDialogClose}
            />
        </Fragment>
    );
}

export default Facility;
