export const LOGIN = "Authenticate/Login";
export const PROFILE = "Users/GetUserProfileByUserId";
export const REGISTER = "Authenticate/Register";

//Batch
export const BATCH_LIST = "/Batch/GetBatchPagination?IsDescending=true";
export const CREATE_BATCH = "/Batch/CreateBatch";

//Break Box
export const BREAK_BOX = "/Products/BreakBox";

//Address
export const PROFILE_UPDATE = "Users/UpdateUserProfile";
export const ADDRESS = "Address/GetAddressByUserId";
export const ADDRESS_DEFAULT = "Address/DefaultOrNot";
export const ADDRESS_CREATE = "Address/CreateAddress";
export const ADDRESS_UPDATE = "Address/UpdateAddress";

//user
export const UPDATE_USER = "Users/UpdateUser/:id";

//product customer
export const PRODUCT_CUSTOMER = "Products/GetUserProductPagination";
export const PRODUCT_CUSTOMER_DETAIL = "Products/GetProductUserById/:id";

//cart
export const CART = "Cart/GetUserCartDisplay";
export const DELETE_CART_ITEM = "/Cart/DeleteCartItem/productId";
export const UPDATE_CART_ITEM_QUANTITY = "/Cart/UpdateCartItemQuantity";
export const CREATE_CART_ITEM = "Cart/CreateCart";
