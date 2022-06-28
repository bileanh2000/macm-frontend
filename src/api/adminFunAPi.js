// https://fakestoreapi.com/docs

import axiosClient from './axiosClient';

const adminFunAPi = {
    // url, params, body
    getClubFund: () => {
        const url = `/admin/treasurer/getclubfund`;
        return axiosClient.get(url);
    },
};
export default adminFunAPi;
