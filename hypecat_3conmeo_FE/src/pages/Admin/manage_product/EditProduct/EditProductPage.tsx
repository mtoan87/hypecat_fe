import { useParams } from "react-router-dom";

import EditProduct from "../../../../containers/product/EditProduct";
import ContainerWrapper from "../../../../components/Container";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import config from "../../../../configs";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <div>Không tìm thấy ID sản phẩm</div>;

  return (
    <>
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
            {
              name: "Chinh sửa sản phẩm",
            },
          ]}
        />

        <EditProduct id={id} />
      </ContainerWrapper>
    </>
  );
};

export default EditProductPage;
