import { Typography } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import notificationApi from 'src/api/notificationApi';

function PaymentNotification() {
    const [paymentStatus, setPaymentStatus] = useState([]);
    const studentId = JSON.parse(localStorage.getItem('currentUser')).studentId;
    const fetchPaymentNotification = async (studentId) => {
        try {
            const response = await notificationApi.checkPaymentStatus(studentId);
            console.log('fetchPaymentNotification', response);
            setPaymentStatus(response.data);
        } catch (error) {
            console.log('failed when fetchPaymentNotification', error);
        }
    };

    useEffect(() => {
        fetchPaymentNotification(studentId);
    }, [studentId]);

    return (
        <ul>
            {paymentStatus.map((i, index) => {
                return (
                    <li key={index} style={{ marginBottom: '5px' }}>
                        - Bạn cần phải đóng tiền cho: {i}
                    </li>
                );
            })}
        </ul>
    );
    // return <Typography>{paymentStatus}</Typography>;
}

export default PaymentNotification;
