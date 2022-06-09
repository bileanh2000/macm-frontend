import { Fragment, useEffect, useState } from 'react';
import productApi from 'src/api/testApi';

function UserManagement() {
    const [productList, setProductList] = useState([]);
    useEffect(() => {
        const fetchProductList = async () => {
            try {
                const response = await productApi.getAll();
                console.log(response);
                setProductList(response);
            } catch (error) {
                console.log('Failed to fetch product list: ', error);
            }
        };
        fetchProductList();
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody>
                {productList.map((item) => {
                    return (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.title}</td>
                            <td>{item.price}</td>
                            <td>
                                <img src={item.image} alt="" height={30} />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default UserManagement;
