import { Grid, MenuItem, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import semesterApi from 'src/api/semesterApi';
import adminAttendanceAPI from 'src/api/adminAttendanceAPI';
import clsx from 'clsx';

function ReportAttendance() {
    const [semester, setSemester] = useState('Summer2022');
    const [semesterList, setSemesterList] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [pageSize, setPageSize] = useState(10);

    const handleChange = (event) => {
        setSemester(event.target.value);
    };

    const fetchSemester = async () => {
        try {
            const response = await semesterApi.getTop3Semester();
            console.log('Thanh cong roi, semester: ', response);
            setSemesterList(response.data);
        } catch (error) {
            console.log('That bai roi huhu, semester: ', error);
        }
    };

    const fetchAttendanceReportBySemester = async (semester) => {
        try {
            const response = await adminAttendanceAPI.attendanceReportBySemester(semester);
            console.log('Thanh cong roi, semester: ', response);
            setAttendanceList(response.data);
        } catch (error) {
            console.log('That bai roi huhu, semester: ', error);
        }
    };

    const header = [{ id: 1 }];
    useEffect(() => {
        fetchSemester();
        fetchAttendanceReportBySemester(semester);
    }, [semester]);

    // const columns = [
    //     { field: 'studentName', headerName: 'Tên sinh viên', flex: 0.5 },
    //     { field: 'studentId', headerName: 'Mã sinh viên', width: 150, flex: 0.3 },
    //     { field: 'roleName', headerName: 'Vai trò trong CLB', width: 150, flex: 0.6 },

    //     {
    //         field: 'totalAbsent',
    //         headerName: 'Số buổi nghỉ',
    //         width: 150,
    //         flex: 0.6,
    //         cellClassName: (params) => {
    //             if (params.value == null) {
    //                 return '';
    //             }
    //             return clsx('status-rows', {
    //                 deactive: true,
    //             });
    //         },
    //     },
    //     {
    //         field: 'percentAbsent',
    //         headerName: 'Phần trăm số buổi nghỉ',
    //         width: 150,
    //         flex: 0.4,
    //         cellClassName: (params) => {
    //             if (params.value == null) {
    //                 return '';
    //             }
    //             return clsx('status-rows-active');
    //         },
    //     },
    // ];

    const columns = header.map((i) => {
        return i;
    });

    const rowsAttendance = attendanceList.map((item, index) => {
        const container = {};
        container['id'] = index + 1;
        container['studentName'] = item.studentName;
        container['studentId'] = item.studentId;
        container['roleName'] = item.roleName;
        container['percentAbsent'] = item.percentAbsent + '%';
        container['totalAbsent'] = item.totalAbsent;
        return container;
    });

    function CustomToolbar() {
        return (
            <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
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

    return (
        <div>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                        Thống kê thành viên tham gia buổi tập
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                        <TextField
                            id="outlined-select-currency"
                            select
                            size="small"
                            label="Chọn kỳ"
                            value={semester}
                            onChange={handleChange}
                        >
                            {semesterList.map((option) => (
                                <MenuItem key={option.id} value={option.name}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Typography>
                </Grid>
                <Grid item xs={4}></Grid>
            </Grid>
            <Box
                sx={{
                    height: '70vh',
                    width: '100%',
                    '& .status-rows': {
                        // justifyContent: 'center !important',
                    },
                    '& .status-rows-active': {
                        justifyContent: 'center !important',
                    },
                    '& .status-rows.deactive': {
                        // backgroundColor: '#ff3838',
                        color: '#ff3838',
                        fontWeight: '600',
                        textAlign: 'center',
                    },
                }}
            >
                {attendanceList.length > 1 ? (
                    <DataGrid
                        loading={!attendanceList.length}
                        disableSelectionOnClick={true}
                        rows={rowsAttendance}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[10, 20, 30]}
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                    />
                ) : (
                    <Typography variant="h4" sx={{ mb: 3 }}>
                        Không có thông tin báo cáo điểm danh
                    </Typography>
                )}
            </Box>
        </div>
    );
}

export default ReportAttendance;
