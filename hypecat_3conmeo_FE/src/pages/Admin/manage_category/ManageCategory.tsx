import { useSearchParams } from "react-router-dom";
import ContainerWrapper from "../../../components/Container";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import CTabs from "../../../components/tabs/CTabs";
import config from "../../../configs";
import CategoryTable from "../../../containers/category/CategoryTable";
import NewsTable from "../../../containers/news/NewsTable";

const tabsLabel = [
  {
    key: "category",
    label: "Loại sản phẩm",
    content: <CategoryTable />,
  },
  {
    key: "news",
    label: "Bài viết",
    content: <NewsTable />,
  },
];
const ManageCategoryPage = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const tabIndex = tabsLabel.findIndex((t) => t.key === tabParam);

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
              name: "Loại sản phẩm",
            },
          ]}
        />

        <CTabs tabs={tabsLabel} defaultTab={tabIndex === -1 ? 0 : tabIndex} />
      </ContainerWrapper>
    </>
  );
};

export default ManageCategoryPage;
