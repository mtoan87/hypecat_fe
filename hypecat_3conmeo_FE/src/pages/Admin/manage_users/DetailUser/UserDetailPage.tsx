import ContainerWrapper from "../../../../components/Container";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import config from "../../../../configs";
import UserDetail from "../../../../containers/user/UserDetail";

const UserDetailPage = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Quản lý khách hàng"
          links={[
            {
              name: "Bảng Thống Kê",
              href: config.adminRoutes.dashboard,
            },
            {
              name: "Quản lý khách hàng",
              href: config.adminRoutes.manageUser,
            },
            {
              name: "Chi tiết người dùng",
            },
          ]}
        />

        <UserDetail />
      </ContainerWrapper>
    </>
  );
};

export default UserDetailPage;
