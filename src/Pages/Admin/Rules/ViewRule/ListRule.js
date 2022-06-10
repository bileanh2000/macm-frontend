import { ModeEditOutline, DeleteForeverOutlined } from "@mui/icons-material";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import adminRuleAPI from 'src/api/adminRuleAPI'


function List() {


    const [rules, setRules] = useState([]);

    // const deleteRuleHandler = (id) => {
    //     props.getRuleId(id);
    // };

    useEffect(() => {
        const getListRules = async () => {
            try {
                const response = await adminRuleAPI.getAll()
                setRules(response.data)
            } catch (error) {
                console.log("Lấy dữ liệu rule thất bại", error);
            }
        }
        getListRules()
    }, [])

    const deleteRule = async (id) => {
        try {
            await adminRuleAPI.delete(id)
        } catch (error) {
            console.log("Xóa rule thất bại", error);
        }
    }


    const handleDelete = params => {
        console.log(params);
        deleteRule(params)
    }

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {rules.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {row.id}
                                </TableCell>
                                <TableCell>
                                    {row.description}
                                </TableCell>
                                <TableCell component={Link}
                                    to={{ pathname: './edit' }}
                                    state={
                                        {
                                            rule: row
                                        }
                                    }>
                                    <ModeEditOutline color="primary" />
                                </TableCell>
                                <TableCell onClick={() => handleDelete(row.id)} >
                                    <DeleteForeverOutlined color="primary" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer >
        </div >

    );
}

export default List;