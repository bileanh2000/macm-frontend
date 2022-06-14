
import axiosClient from './axiosClient';

const adminRuleAPI = {
    getAll: (data) => {
        const url = '/rule/getallrule';
        return axiosClient.get(url, {
            params: {
                pageNo: data
            }
        });
    },

    create: (params) => {
        const url = '/rule/vicehead/addrule';
        return axiosClient.post(url, params);
    },

    update: (params) => {
        const url = `rule/vicehead/editrulebyid/${params.id}`;
        return axiosClient.put(url, { description: params.description });
    },

    delete: (id) => {
        const url = `rule/vicehead/deleterulebyid/${id}`;
        return axiosClient.delete(url, id);
    },
};

export default adminRuleAPI;
