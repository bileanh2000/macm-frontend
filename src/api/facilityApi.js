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

    getAllFacilityReport: (select) => {
        const url = `/facility/headtechnique/getfacilityreport?filterIndex=${select}`;
        return axiosClient.get(url);
    },
    getAllRequest: () => {
        const url = `/facility/treasurer/getallrequesttobuyfacility?pageNo=0&pageSize=10000&sortBy=id`;
        return axiosClient.get(url);
    },
    createNewCategory: (params) => {
        const url = `/facilitycategory/headtechnique/addnewcategories`;
        return axiosClient.post(url, [params]);
    },

    deleteCategory: (id) => {
        const url = `/facilitycategory/headtechnique/delete/${id}`;
        return axiosClient.put(url);
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

    approveRequestToBuyFacility: (facilityRequestId) => {
        const url = `/facility/treasurer/approverequesttobuyfacility/${facilityRequestId}`;
        return axiosClient.put(url);
    },

    declineRequestToBuyFacility: (facilityRequestId) => {
        const url = `/facility/treasurer/declinerequesttobuyfacility/${facilityRequestId}`;
        return axiosClient.put(url);
    },
};
export default facilityApi;
