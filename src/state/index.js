import { createGlobalState } from 'react-hooks-global-state';

const { setGlobalState, useGlobalState } = createGlobalState({
    totalNotification: 0,
    alreadyVisited: true,
    allRole: [],
    loginErrorStatus: '',
});

export { useGlobalState, setGlobalState };
