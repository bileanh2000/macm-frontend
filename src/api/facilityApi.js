// https://fakestoreapi.com/docs

import axiosClient from './axiosClient';

const facilityApi = {
    // url, params, body
    getAll: () => {
        const url = '/facility/headtechnique/getallfacility?pageNo=0&pageSize=1000&sortBy=id';
        return axiosClient.get(url);
    },

    createPreviewEvent: (params) => {
        const url = '/eventschedule/headculture/createpreview/';
        return axiosClient.post(url, null, {
            params: {
                eventName: params.name,
                startDate: params.startDate,
                finishDate: params.finishDate,
                startTime: params.startTime,
                finishTime: params.finishTime,
                // IsContinuous: params.IsContinuous,
            },
        });
    },
};
export default facilityApi;
