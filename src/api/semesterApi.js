import axiosClient from './axiosClient';

const semesterApi = {
    getTop3Semester: () => {
        const url = '/semester/getTop3Semesters';
        return axiosClient.get(url);
    },
    getCurrentSemester: () => {
        const url = '/trainingschedule/gettrainingschedule';
        return axiosClient.get(url);
    },
};
export default semesterApi;
