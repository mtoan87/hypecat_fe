import ContainerWrapper from "../../../components/Container";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import TableBatch from "../../../containers/batch/TableBatch";

const BatchPage = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Quản lí lô hàng"
          links={[
            {
              name: "Bảng thống kê",
              href: config.adminRoutes.dashboard,
            },
            {
              name: "Quản lí lô hàng",
              href: config.adminRoutes.manageBatch,
            },
          ]}
        />

        <TableBatch />
      </ContainerWrapper>
    </>
  );
};

export default BatchPage;
