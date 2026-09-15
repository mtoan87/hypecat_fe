import ContainerWrapper from "../../../components/Container";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import ManageOrderTable from "../../../containers/order/ManageOrderTable";

const ManageOrderPage = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Quản lý đơn hàng"
          links={[
            {
              name: "Bảng Thống Kê",
              href: config.adminRoutes.dashboard,
            },
            {
              name: "Quản lý đơn hàng",
            },
          ]}
        />

        <ManageOrderTable />
      </ContainerWrapper>
    </>
  );
};

export default ManageOrderPage;
