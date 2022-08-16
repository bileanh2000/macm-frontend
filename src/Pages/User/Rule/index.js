import { useEffect, useState } from 'react';
import { Box, Divider, Grid, Pagination, Paper, Stack, Typography } from '@mui/material';

import adminRuleAPI from 'src/api/adminRuleAPI';

function Rule() {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [rules, setRules] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [isRender, setIsRender] = useState(true);

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
        isRender && getListRules(page - 1);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
        setIsRender(false);
    }, [page, isRender, rules]);

    return (
        <Box sx={{ m: 1, p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500 }}>
                    Nội quy câu lạc bộ
                </Typography>
            </Box>
            <Divider />
            <Box sx={{ m: 2 }}>
                {rules.map((row, index) => (
                    <Paper elevation={1} key={index} sx={{ minHeight: 10, p: 2, m: 2 }}>
                        <Grid container spacing={2} sx={{ m: 0, alignItems: 'center' }}>
                            <Grid item xs={1} sx={{ p: 1 }}>
                                {(page - 1) * pageSize + index + 1}
                            </Grid>
                            <Grid item xs={11} sx={{ p: 1 }}>
                                {row.description}
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
        </Box>
    );
}

export default Rule;
