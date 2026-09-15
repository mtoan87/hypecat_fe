import { useParams } from "react-router-dom";
import DetailProduct from "../../../../containers/product/DetailProduct";
import ContainerWrapper from "../../../../components/Container";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import config from "../../../../configs";

const DetailProductPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <div>Không tìm thấy ID sản phẩm</div>;

  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Sản phẩm chi tiết"
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
              name: "Chi tiết sản phẩm",
            },
          ]}
        />

        <DetailProduct id={id} />
      </ContainerWrapper>
    </>
  );
};

export default DetailProductPage;
