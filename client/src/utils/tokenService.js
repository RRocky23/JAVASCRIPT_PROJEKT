export const tokenKey = 'accessToken';

export const getAccessToken = () => {
    try {
        return localStorage.getItem(tokenKey);
    } 
    catch {
        return null;
    }
};

export const setAccessToken = (token, remember) => {
    try {
        if(remember) {
            localStorage.setItem(tokenKey, token);
        } 
        else {
            localStorage.setItem(tokenKey, token);
        }
    } 
    catch {

    }
};

export const removeAccessToken = () => {
    try {
        localStorage.removeItem(tokenKey);
    } 
    catch {
        
    }
};
