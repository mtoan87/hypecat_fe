import { useParams } from "react-router-dom";
import DetailOrder from "../../../../containers/order/DetailOrder";
import ContainerWrapper from "../../../../components/Container";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import config from "../../../../configs";

const DetailOrderPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <div>Không tìm thấy ID sản phẩm</div>;

  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Chi tiết đơn hàng"
          links={[
            {
              name: "Bảng Thống Kê",
              href: config.adminRoutes.dashboard,
            },
            {
              name: "Quản lý đơn hàng",
              href: config.adminRoutes.manageOrder,
            },
            {
              name: "Chi tiết đơn hàng" + id,
            },
          ]}
        />

        <DetailOrder orderId={id} />
      </ContainerWrapper>
    </>
  );
};

export default DetailOrderPage;
