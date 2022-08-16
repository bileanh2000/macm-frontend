// https://fakestoreapi.com/docs

import axiosClient from './axiosClient';

const adminFunAPi = {
    // url, params, body
    getClubFund: () => {
        const url = `/admin/treasurer/getclubfund`;
        return axiosClient.get(url);
    },

    getClubFundReport: () => {
        const url = '/admin/treasurer/getclubfundreport';
        return axiosClient.get(url);
    },

    depositToClubFund: (amount, note, studentId) => {
        const url = `/admin/treasurer/deposittoclubfund/${amount}/${studentId}`;
        return axiosClient.put(url, null, { params: { note: note } });
    },

    withdrawFromClubFund: (amount, note, studentId) => {
        const url = `/admin/treasurer/withdrawfromclubfund/${amount}/${studentId}`;
        return axiosClient.put(url, null, { params: { note: note } });
    },
};
export default adminFunAPi;
