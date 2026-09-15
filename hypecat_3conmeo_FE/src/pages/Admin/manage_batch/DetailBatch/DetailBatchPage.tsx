import { useParams } from "react-router-dom";
import TableBatchDetail from "../../../../containers/batch/TableBatchDetail";
import ContainerWrapper from "../../../../components/Container";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import config from "../../../../configs";

const DetailBatchPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <div>Không tìm thấy ID sản phẩm</div>;

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
              name: "Quản lí lô hàng",
              href: config.adminRoutes.manageBatch,
            },
            {
              name: "Lô hàng chi tiết # " + id,
              href: config.adminRoutes.manageBatch,
            },
          ]}
        />

        <TableBatchDetail id={id} />
      </ContainerWrapper>
    </>
  );
};

export default DetailBatchPage;
