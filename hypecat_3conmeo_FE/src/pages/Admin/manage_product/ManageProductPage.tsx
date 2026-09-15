import type React from "react";
import ProductTable from "../../../containers/product/ProductTable";
import ContainerWrapper from "../../../components/Container";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";

const ProductPage: React.FC = () => {
  return (
    <>
      <title>HypeCat | Quản lý sản phẩm</title>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Quản lý sản phẩm"
          links={[
            {
              name: "Bảng thống kê",
              href: config.adminRoutes.dashboard,
            },
            {
              name: "Quản lí sản phẩm",
              href: config.adminRoutes.manageProduct,
            },
          ]}
        />

        <ProductTable />
      </ContainerWrapper>
    </>
  );
};

export default ProductPage;
