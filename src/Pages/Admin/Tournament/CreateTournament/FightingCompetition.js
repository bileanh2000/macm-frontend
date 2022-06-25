import {
    Button,
    Collapse,
    Fab,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import React, { useState } from 'react';
import { Add } from '@mui/icons-material';

const weightMale = [
    { id: 1, weight: '42-45 kg' },
    { id: 2, weight: '45-48 kg' },
    { id: 3, weight: '48-51 kg' },
    { id: 4, weight: '51-54 kg' },
    { id: 5, weight: '54-57 kg' },
    { id: 6, weight: '57-60 kg' },
    { id: 7, weight: '60-63.5 kg' },
    { id: 8, weight: '63.5-67 kg' },
    { id: 9, weight: '67-69 kg' },
    { id: 10, weight: '69-71 kg' },
    { id: 11, weight: '71-75 kg' },
    { id: 12, weight: '75-81 kg' },
    { id: 13, weight: '81-85 kg' },
];

const weightFemale = [
    { id: 14, weight: '39-42 kg' },
    { id: 15, weight: '42-45 kg' },
    { id: 16, weight: '45-48 kg' },
    { id: 17, weight: '48-51 kg' },
    { id: 18, weight: '51-54 kg' },
    { id: 19, weight: '54-57 kg' },
    { id: 20, weight: '57-60 kg' },
    { id: 21, weight: '60-63.5 kg' },
];

function FightingCompetition(props) {
    const [datas, setDatas] = useState(props.data);
    const [isChecked, setIsChecked] = useState(false);
    const [gender, setGender] = useState('Nam');
    const [weightList, setWeightList] = useState(weightMale);
    const [_weight, setWeight] = useState(weightMale[0].id);
    const [weightText, setWeightText] = useState(weightMale[0].weight);

    const handleChange = (event) => {
        console.log(event.target.value);
        setGender(event.target.value);
        if (event.target.value === 'Nam') {
            setWeight(weightMale[0].id);
            setWeightList(weightMale);
            setWeightText(weightMale[0].weight);
        } else {
            setWeight(weightFemale[0].id);
            setWeightList(weightFemale);
            setWeightText(weightFemale[0].weight);
        }
    };

    const handleChangeWeight = (event) => {
        setWeight(event.target.value);
        if (gender == 'Nam') {
            setWeightText(weightMale.find((weight) => weight.id == event.target.value).weight);
        } else {
            setWeightText(weightFemale.find((weight) => weight.id == event.target.value).weight);
        }
        console.log(weightText);
        console.log(event.target.value);
    };

    const handleAddCompetition = () => {
        console.log('hihi');
        console.log(gender, weightText);
        console.log(datas);
        const newData = datas.map((data) => {
            return data.gender === gender
                ? data.weight.indexOf(weightText) !== -1
                    ? data
                    : { ...data, weight: [...data.weight, weightText] }
                : data;
        });
        setDatas(newData);
        props.onAddFightingCompetition(newData);
        console.log(newData);
        setIsChecked(!isChecked);
    };

    return (
        <Paper sx={{ width: '100%' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Giới tính</TableCell>
                            <TableCell align="center">Hạng cân</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datas.map((data) =>
                            data.weight.map((d, index) => (
                                <TableRow key={index}>
                                    {index == 0 && <TableCell rowSpan={data.weight.length}>{data.gender}</TableCell>}
                                    <TableCell>{data.weight[index]}</TableCell>
                                </TableRow>
                            )),
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Collapse in={isChecked}>
                <InputLabel id="demo-simple-select-label">Giới tính</InputLabel>
                <Select labelId="demo-simple-select-label" id="gender" value={gender} onChange={handleChange}>
                    <MenuItem value={'Nam'}>Nam</MenuItem>
                    <MenuItem value={'Nữ'}>Nữ</MenuItem>
                </Select>
                <Select labelId="demo-simple-select-label" id="gender" value={_weight} onChange={handleChangeWeight}>
                    {weightList.map((w) => (
                        <MenuItem value={w.id} key={w.id}>
                            {w.weight}
                        </MenuItem>
                    ))}
                </Select>
                <Button variant="contained" color="success" onClick={handleAddCompetition}>
                    Thêm
                </Button>
                <Button variant="contained" color="warning" onClick={() => setIsChecked(!isChecked)}>
                    Hủy
                </Button>
            </Collapse>

            <Collapse in={!isChecked}>
                <Fab color="primary" aria-label="add" onClick={() => setIsChecked(!isChecked)}>
                    <Add />
                </Fab>
            </Collapse>
        </Paper>
    );
}
export default FightingCompetition;
