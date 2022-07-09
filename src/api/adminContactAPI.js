import axiosClient from './axiosClient';

const adminContactAPI = {
    getContact: () => {
        const url = '/contact/getallcontact';
        return axiosClient.get(url);
    },

    getSocialNetwork: () => {
        const url = '/contact/getallsocialnetwork';
        return axiosClient.get(url);
    },

    updateContact: (params) => {
        const url = `/contact/headcommunication/updatecontact`;
        return axiosClient.put(url, params);
    },

};

export default adminContactAPI;