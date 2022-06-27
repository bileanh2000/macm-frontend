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
    GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import facilityApi from 'src/api/facilityApi';
import { useEffect } from 'react';
import RequestFacilityDialog from './RequestFacilityDialog';
import AddFacilityDialog from './AddFacilityDialog';
import EditFacilityDialog from './EditFacilityDialog';
import AssessmentIcon from '@mui/icons-material/Assessment';
import UpdateCategoryDialog from './UpdateCategoryDialog';
import { Refresh } from '@mui/icons-material';
import moment from 'moment';

function ReportFacility() {
    const [categoryId, setCategoryId] = useState(0);
    const [facilityList, setFacilityList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [pageSize, setPageSize] = useState(30);
    const [open, setOpen] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openUpdateCategory, setOpenUpdateCategory] = useState(false);
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [facilityId, setFacilityId] = useState('');
    const [selectFacility, setSelectFacility] = useState([]);

    const reload = () => window.location.reload();

    const [filterFacility, setFilterFacility] = useState([
        {
            facilityCategoryName: '',
            facilityId: '',
            facilityName: '',
            quantityBroken: '',
            quantityUsable: '',
        },
    ]);

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
        setCategoryId(event.target.value);
    };
    const fetchFacility = async () => {
        try {
            const response = await facilityApi.getAllFacilityReport();

            console.log('fetchFacility', response.data);
            setFacilityList(response.data);
        } catch (error) {
            console.log('fetch facility failed', error);
        }
    };
    const fetchFacilityCategory = async () => {
        try {
            const response = await facilityApi.getAllFacilityCategory();
            console.log('fetchFacilityCategory', response.data);
            setCategoryList(response.data);
        } catch (error) {
            console.log('fetch facility failed', error);
        }
    };

    useEffect(() => {
        fetchFacility(categoryId);
    }, [categoryId]);

    useEffect(() => {
        fetchFacilityCategory();
    }, []);
    useEffect(() => {
        console.log('filterFacility', filterFacility);
    }, [filterFacility]);

    const rowData = facilityList.map((item, index) => {
        const container = {};
        container['id'] = index;
        container['createdOn'] = moment(item.createdOn).format('HH:mm - DD/MM/YYYY');
        container['description'] = item.description;
        return container;
    });
    const columns = [
        { field: 'createdOn', headerName: 'Tên', flex: 1 },
        { field: 'description', headerName: 'Danh mục', flex: 1 },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 0.5,
        //     getActions: (params) => [
        //         <GridActionsCellItem
        //             icon={<EditIcon />}
        //             label="Chỉnh sửa"
        //             onClick={() => {
        //                 console.log(params.row);
        //                 setSelectFacility({
        //                     facilityId: params.row.facilityId,
        //                     facilityName: params.row.facilityName,
        //                     facilityCategoryId: params.row.facilityCategoryId,
        //                     quantityUsable: params.row.quantityUsable,
        //                     quantityBroken: params.row.quantityBroken,
        //                 });
        //                 setFacilityId(params.row.facilityId);
        //                 setOpenEditDialog(true);
        //             }}
        //         />,
        //     ],
        // },
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" color="initial" sx={{ fontWeight: 500 }}>
                    Báo cáo cơ sở vật chất
                </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
                <TextField
                    id="outlined-select-currency"
                    size="small"
                    select
                    label="Danh mục"
                    value={categoryId}
                    onChange={handleChangeCategory}
                >
                    <MenuItem value={0}>Tất cả</MenuItem>
                    {categoryList.map((item) => {
                        return (
                            <MenuItem key={item.id} value={item.id}>
                                {item.name}
                            </MenuItem>
                        );
                    })}
                    {/* <MenuItem value={1}>Áo chống đạn</MenuItem>
                    <MenuItem value={2}>Súng trường</MenuItem>
                    <MenuItem value={3}>Súng lục</MenuItem>
                    <MenuItem value={4}>Cận chiến</MenuItem> */}
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
        </Fragment>
    );
}

export default ReportFacility;
