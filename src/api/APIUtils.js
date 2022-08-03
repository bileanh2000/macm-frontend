import { API_BASE_URL, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN));
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options).then((response) =>
        response.json().then((json) => {
            if (!response.ok) {
                // localStorage.setItem('alreadyLogged', 'false');
                return Promise.reject(json);
            }
            localStorage.setItem('currentUser', JSON.stringify(json));
            // localStorage.setItem('alreadyLogged', 'true');

            return json;
        }),
    );
};

export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject('No access token set.');
    }

    return request({
        url: API_BASE_URL + '/profile',
        method: 'GET',
    });
}
