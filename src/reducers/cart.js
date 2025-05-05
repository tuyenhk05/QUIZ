const initialState = {
    id: null,
    isLogin: false
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'is_login':
            return {
                ...state,
                id: action.id,
                isLogin: action.isLogin,
                fullName:action.fullName
            };
        case 'lockout':
            return {
                ...state,
                id: null,
                isLogin: false
            };
        default:
            return state;
    }
};

export default cartReducer;
