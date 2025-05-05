const addtoCart = (id, info) => {
    return {
        type: "ADD_TO_CART",
        id: id,
        info: info
    }
}
const updateLogin = (state,id,fullName) => {
    return {
        type: "is_login",
        id: id,
        isLogin: state,
        fullName:fullName
        
    }
}
const lockout = () => {
    return {
        type: "lockout",
       
    }
}
export { addtoCart, updateLogin, lockout };

