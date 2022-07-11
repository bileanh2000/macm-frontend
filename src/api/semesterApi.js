import axiosClient from './axiosClient';

const semesterApi = {
    getTop3Semester: () => {
        const url = '/semester/gettop3semesters';
        return axiosClient.get(url);
    },
    getCurrentSemester: () => {
        const url = '/semester/currentsemester';
        return axiosClient.get(url);
    },
};
export default semesterApi;
