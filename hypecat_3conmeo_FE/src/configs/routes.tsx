export const managerRoutes = {
  home: "/",
};

export const authRoutes = {
  authenticate: "/authenticate",
  register: "/register",
};

export const adminRoutes = {
  dashboard: "/dashboard",
  manageProduct: "/manage-product",
  CreateProduct: "/create-product",
  ManageProductDetail: "/manage-product/:id/detail",
  EditProductDetail: "/manage-product/:id/edit",
  manageBatch: "/manage-batch",
  manageBatchDetail: "/manage-batch/:id",
  importBatch: "/import-batch",
  manageOrder: "/manage-order",
  detailOrder: "/manage-order/:id/orderDetail",
  manageUser: "/manage-user",
  detailUser: "/manage-user/:id/detail",
  manageCategory: "/manage-category",
  //manageNews: "/manage-news",
  createNews: "/manage-news/create",
  editNews: "/manage-news/:id/edit",
  detailNews: "/manage-news/:id/detail",
};

export const staffRoutes = {};

export const customerRoutes = {
  cart: "/cart",
  userProfile: "/user-profile",
  aboutUs: "/about-us",
  privacyPolicy: "/privacy-policy",
  introduction: "/introduction",
  home: "/",
  news: "/news",
  newsDetail: "/news/:id/detail",
  productList: "/product-list",
  productDetail: "/product-detail/:id",
  test: "/test",
  address: "/address",
  addressList: "/address-list",
  paymentMethod: "/payment-method",
  order: "/order",
};
