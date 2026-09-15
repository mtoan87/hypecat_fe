import ContainerWrapper from "../../../components/Container";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import ManageUserTable from "../../../containers/user/ManageUserTable";

const ManageUserPage = () => {
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
            },
          ]}
        />

        <ManageUserTable />
      </ContainerWrapper>
    </>
  );
};

export default ManageUserPage;
