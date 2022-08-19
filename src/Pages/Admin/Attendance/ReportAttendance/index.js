import { Grid, MenuItem, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import semesterApi from 'src/api/semesterApi';
import adminAttendanceAPI from 'src/api/adminAttendanceAPI';
import clsx from 'clsx';
import moment from 'moment';
import LoadingProgress from 'src/Components/LoadingProgress';

function ReportAttendance() {
    const [semester, setSemester] = useState('Summer2022');
    const [roleId, setRoleId] = useState(0);
    const [semesterList, setSemesterList] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [columns, setColumns] = useState([]);
    const [pageSize, setPageSize] = useState(30);

    const handleChange = (event) => {
        setSemester(event.target.value);
    };
    const handleChangeRoleId = (event) => {
        setRoleId(event.target.value);
    };

    const fetchSemester = async () => {
        try {
            const response = await semesterApi.getTop3Semester();
            console.log('Thanh cong roi, semester: ', response);
            setSemesterList(response.data);
            console.log(response);
        } catch (error) {
            console.log('That bai roi huhu, semester: ', error);
        }
    };

    const fetchAttendanceReportBySemester = async (semester, id) => {
        try {
            const response = await adminAttendanceAPI.getAttendanceTrainingStatistic(semester, id);
            console.log('fetchAttendanceReportBySemester: ', response);
            setAttendanceList(response.data);
            let header = Object.keys(response.data[0]);
            let columns = header.map((i) => {
                return {
                    field: i,
                    headerName:
                        i === 'studentId'
                            ? 'Mã sinh viên'
                            : i === 'name'
                            ? 'Tên'
                            : i === 'percentAbsent'
                            ? 'Phần trăm nghỉ'
                            : i === 'totalSession'
                            ? 'Tổng số buổi'
                            : i === 'totalAbsent'
                            ? 'Tổng số buổi nghỉ'
                            : i === 'roleName'
                            ? 'Vai trò'
                            : moment(i).format('DD/MM'),
                    cellClassName: (params) => {
                        if (params.value == null) {
                            return '';
                        }

                        return clsx('status-rows', {
                            _absent: params.value === 'X',
                            _attended: params.value === 'V',
                            _notyet: params.value === '-',
                        });
                    },

                    ...(i === 'name'
                        ? { width: 200 }
                        : i === 'studentId'
                        ? { width: 100 }
                        : i === 'percentAbsent'
                        ? { width: 100 }
                        : i === 'totalSession'
                        ? { width: 100 }
                        : i === 'totalAbsent'
                        ? { width: 100 }
                        : i === 'id'
                        ? { hide: true }
                        : i === 'roleName'
                        ? { width: 200 }
                        : { flex: 1 }),
                };
            });
            const results = columns.filter((element) => {
                if (Object.keys(element).length !== 0) {
                    return true;
                }

                return false;
            });
            setColumns(results);
        } catch (error) {
            console.log('failed when fetchAttendanceReportBySemester: ', error);
        }
    };

    useEffect(() => {
        fetchSemester();
        fetchAttendanceReportBySemester(semester, roleId);
    }, [semester, roleId]);

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
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ ml: 1 }}>
                        <span>
                            <strong style={{ color: 'green' }}>V</strong>:
                        </span>
                        <span> Có mặt </span>
                    </Box>
                    <Box sx={{ ml: 1 }}>
                        <span>
                            <strong style={{ color: 'red' }}>X</strong>:
                        </span>
                        <span> Vắng mặt</span>
                    </Box>
                    <Box sx={{ ml: 1 }}>
                        <span>
                            <strong style={{ color: 'blue' }}>╺</strong>:
                        </span>
                        <span> Chưa điểm danh</span>
                    </Box>
                </Box>
            </GridToolbarContainer>
        );
    }
    if (!attendanceList[0]) {
        return <LoadingProgress />;
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
                            sx={{ mr: 1 }}
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
                        <TextField
                            id="outlined-select-currency"
                            select
                            size="small"
                            label="Chọn vai trò"
                            value={roleId}
                            onChange={handleChangeRoleId}
                        >
                            <MenuItem value={0}>Tất cả</MenuItem>
                            <MenuItem value={-1}>Thành viên</MenuItem>
                            <MenuItem value={-2}>Cộng tác viên</MenuItem>
                            <MenuItem value={10}>Thành viên ban truyền thông</MenuItem>
                            <MenuItem value={11}>Thành viên ban văn hóa</MenuItem>
                            <MenuItem value={12}>Thành viên ban chuyên môn</MenuItem>
                            <MenuItem value={13}>CTV ban truyền thông</MenuItem>
                            <MenuItem value={14}>CTV ban văn hóa</MenuItem>
                            <MenuItem value={15}>CTV ban chuyên môn</MenuItem>
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
                    // '& .status-rows-active': {
                    //     justifyContent: 'center !important',
                    // },
                    '& .status-rows._absent': {
                        // backgroundColor: '#ff3838',
                        color: 'red',
                        fontWeight: '600',
                        textAlign: 'center',
                    },
                    '& .status-rows._attended': {
                        // backgroundColor: '#ff3838',
                        color: 'green',
                        fontWeight: '600',
                        textAlign: 'center',
                    },
                    '& .status-rows._notyet': {
                        // backgroundColor: '#ff3838',
                        color: 'blue',
                        fontWeight: '600',
                        textAlign: 'center',
                    },
                }}
            >
                {attendanceList.length >= 1 ? (
                    <DataGrid
                        loading={!attendanceList.length}
                        disableSelectionOnClick={true}
                        rows={attendanceList}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[30, 50, 70]}
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                        // initialState={{ pinnedColumns: { left: ['name'] } }}
                        initialState={{
                            pinnedColumns: { left: ['name'] },
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
