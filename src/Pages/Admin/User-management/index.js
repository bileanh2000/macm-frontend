import { Fragment, useEffect, useState } from 'react';
import productApi from 'src/api/userApi';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function UserManagement() {
    const [productList, setProductList] = useState([]);
    useEffect(() => {
        const fetchProductList = async () => {
            try {
                const response = await productApi.getAll();
                console.log(response);
                setProductList(response.data);
            } catch (error) {
                console.log('Failed to fetch product list: ', error);
            }
        };
        fetchProductList();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        { field: 'age', headerName: 'Age', width: 90 },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
    ];

    return (
        <Button component={Link} to="/admin/users/member">
            123
        </Button>
        // <table>
        //     <thead>
        //         <tr>
        //             <th>No</th>
        //             <th>Title</th>
        //             <th>Price</th>
        //             <th>Image</th>
        //         </tr>
        //     </thead>
        //     <tbody>
        //         {productList.map((item) => {
        //             return (
        //                 <tr key={item.id}>
        //                     <td>{item.name}</td>
        //                     <td>{item.gender ? <Fragment>Nam</Fragment> : <Fragment>Nữ</Fragment>}</td>
        //                     <td>{item.studentId}</td>
        //                     <td>{item.role.name}</td>
        //                     <td>
        //                         <img src={item.image} alt="" height={30} />
        //                     </td>
        //                 </tr>
        //             );
        //         })}
        //     </tbody>
        // </table>
    );
}

export default UserManagement;
