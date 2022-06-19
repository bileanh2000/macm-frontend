import { Typography } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import eventApi from 'src/api/eventApi';

function EventDetail() {
    let { id } = useParams();
    const [event, setEvent] = useState();
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
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                Thông tin sự kiện {id}
            </Typography>
            {event &&
                event.map((item) => {
                    return (
                        <div key={item.id}>
                            <p>{item.name}</p>
                            <p>{item.description}</p>
                            <p>Số thành viên ban tổ chức: {item.maxQuantityComitee}</p>
                        </div>
                    );
                })}
        </Fragment>
    );
}

export default EventDetail;
