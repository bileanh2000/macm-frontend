import { Typography } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import eventApi from 'src/api/eventApi';

function EventDetail() {
    let { id } = useParams();
    const [event, setEvent] = useState([]);
    const [eventName, setEventName] = useState();
    const getListEvents = async () => {
        try {
            // const params = { name: 'Đi chùa' };
            const response = await eventApi.getAll();
            // setEvent(response.data);
            let selectedEvent = response.data.filter((item) => item.id === parseInt(id, 10));
            setEvent(selectedEvent);
            console.log(event);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };

    useEffect(() => {
        getListEvents();
        console.log(event);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, []);

    return (
        <Fragment>
            {event.map((item) => {
                return (
                    <Fragment key={item.id}>
                        <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                            Thông tin sự kiện "{item.name}"
                        </Typography>
                        <div>
                            {/* <p>{item.name}</p> */}
                            <p>{item.description}</p>
                            <div>
                                <Typography variant="subtitle1">
                                    <strong>Số thành viên ban tổ chức:</strong> {item.maxQuantityComitee}
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    <strong>Tổng chi phí: </strong> {item.totalAmount.toLocaleString('en-US')} vnđ
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    <strong>Số tiền mỗi người phải đóng: </strong>
                                    {item.amountPerMemberRegister.toLocaleString('en-US')} vnđ
                                </Typography>
                            </div>
                        </div>
                    </Fragment>
                );
            })}
        </Fragment>
    );
}

export default EventDetail;
