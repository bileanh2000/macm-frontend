
import axiosClient from './axiosClient';

const adminNewsAPI = {
    getNews: () => {
        const url = '/news/getallnews';
        return axiosClient.get(url);
    },

    getNewsbyId: (id) => {
        const url = `/news/getnewsbyid/${id}`;
        return axiosClient.get(url);
    },

    createNews: (data) => {
        const url = `/news/headcommunication/createnews`;
        return axiosClient.post(url, data, {
            params: { isSendNotification: data.isSendNotification },
        });
    },

    deleteNews: (id) => {
        const url = `/news/headcommunication/deletenewsbyid/${id}`;
        return axiosClient.delete(url);
    },

    editNews: (params) => {
        const url = `/news/headcommunication/editnews/${params.id}`;
        return axiosClient.put(url, params);
    },

    updateStatusNews: (data) => {
        const url = `/news/headcommunication/updatenewsstatus/${data.id}`;
        return axiosClient.put(url, null, {
            params: {
                status: data.status,
            },
        });
    },
    getAllNotification: (pageNo) => {
        const url = `notification/getallnotification`;
        return axiosClient.get(url, {
            params: {
                pageNo: pageNo,
                pageSize: '5'
            },
        });
    },
};

export default adminNewsAPI;
