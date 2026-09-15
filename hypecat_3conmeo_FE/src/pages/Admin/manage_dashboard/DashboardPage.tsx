import { Paper } from "@mui/material";
import ContainerWrapper from "../../../components/Container";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import Dashboard from "../../../containers/analytics/Dashboard";

const DashboardPage = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Bảng Thống Kê"
          links={[
            {
              name: "Bảng Thống Kê",
              href: config.adminRoutes.dashboard,
            },
          ]}
        />

        <Paper
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minHeight: "calc(100vh - 64px - 48px)",
          }}
        >
          <Dashboard />
        </Paper>
      </ContainerWrapper>
    </>
  );
};

export default DashboardPage;
