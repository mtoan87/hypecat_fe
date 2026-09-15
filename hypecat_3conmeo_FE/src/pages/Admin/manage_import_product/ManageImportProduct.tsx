import ContainerWrapper from "../../../components/Container";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import ImportProduct from "../../../containers/importProduct/ImportProduct";

const ManageImportBatchPage = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Quản lý loại sản phẩm"
          links={[
            {
              name: "Bảng Thống Kê",
              href: config.adminRoutes.dashboard,
            },
            {
              name: "Nhập hàng",
            },
          ]}
        />

        <ImportProduct />
      </ContainerWrapper>
    </>
  );
};

export default ManageImportBatchPage;
