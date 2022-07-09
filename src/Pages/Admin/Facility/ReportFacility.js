import { Box } from '@mui/system';
import { Fragment, useState } from 'react';
import Typography from '@mui/material/Typography';
import { MenuItem, TextField } from '@mui/material';

import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';

import facilityApi from 'src/api/facilityApi';
import { useEffect } from 'react';

import moment from 'moment';

function ReportFacility() {
    const [categoryId, setCategoryId] = useState(0);
    const [reportList, setReportList] = useState([]);

    const [pageSize, setPageSize] = useState(30);

    const handleChangeCategory = (event) => {
        setCategoryId(event.target.value);
    };
    const fetchFacilityReport = async (params) => {
        try {
            const response = await facilityApi.getAllFacilityReport(params);

            console.log('fetchFacility', response.data);
            setReportList(response.data);
        } catch (error) {
            console.log('fetch facility failed', error);
        }
    };

    useEffect(() => {
        fetchFacilityReport(categoryId);
    }, [categoryId]);
    const rowData = reportList.map((item, index) => {
        const container = {};
        container['id'] = index;
        container['createdOn'] = moment(item.createdOn).format('HH:mm - DD/MM/YYYY');
        container['description'] = item.description;
        return container;
    });
    const columns = [
        { field: 'createdOn', headerName: 'Ngày giờ', flex: 1 },
        {
            field: 'description',
            headerName: 'Nội dung',
            flex: 1,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('status-rows', {
                    bonus: params.value.split(' ')[0] === 'Thêm',
                    minus: params.value.split(' ')[0] !== 'Thêm',
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
                    label="Tình trạng"
                    value={categoryId}
                    onChange={handleChangeCategory}
                >
                    <MenuItem value={0}>Tất cả</MenuItem>
                    <MenuItem value={1}>Thêm</MenuItem>
                    <MenuItem value={2}>Hỏng, mất</MenuItem>
                </TextField>
            </Box>
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
                    '& .status-rows.bonus': {
                        backgroundColor: '#56f000',
                        color: '#fff',
                        fontWeight: '600',
                        textAlign: 'center',
                    },
                    '& .status-rows.minus': {
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
