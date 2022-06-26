// https://fakestoreapi.com/docs

import axiosClient from './axiosClient';

const facilityApi = {
    // url, params, body
    getAllFacilityByCategoryId: (id) => {
        const url = `/facility/headtechnique/getallfacilitybyfacilitycategoryid?facilityCategoryId=${id}&pageNo=0&pageSize=1000&sortBy=id`;
        return axiosClient.get(url);
    },

    createRequestToBuy: (data) => {
        const url = '/facility/headtechnique/createrequesttobuyfacility';
        return axiosClient.post(url, data);
    },
    getAllFacilityCategory: () => {
        const url = '/facilitycategory/headtechnique/getallcategories';
        return axiosClient.get(url);
    },
    createNewFacility: (data) => {
        const url = '/facility/headtechnique/createnewfacility';
        return axiosClient.post(url, data);
    },
    updateFacility: (facilityId, data) => {
        const url = `/facility/headtechnique/updatefacilitybyid/${facilityId}`;
        return axiosClient.put(url, data);
    },

    getAllFacilityReport: () => {
        const url = `/facility/headtechnique/getfacilityreport`;
        return axiosClient.get(url);
    },

    // createPreviewEvent: (params) => {
    //     const url = '/facility/headtechnique/createnewfacility';
    //     return axiosClient.post(url, null, {
    //         params: {
    //             eventName: params.name,
    //             startDate: params.startDate,
    //             finishDate: params.finishDate,
    //             startTime: params.startTime,
    //             finishTime: params.finishTime,
    //             // IsContinuous: params.IsContinuous,
    //         },
    //     });
    // },
};
export default facilityApi;
