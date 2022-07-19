import { Typography } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import notificationApi from 'src/api/notificationApi';

function PaymentNotification() {
    const [paymentStatus, setPaymentStatus] = useState();
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

    return <Typography>{paymentStatus}</Typography>;
}

export default PaymentNotification;
