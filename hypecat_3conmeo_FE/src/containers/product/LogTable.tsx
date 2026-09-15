/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import type { ProductLog } from "../../types/ProductType";
import CTable from "../../components/table/CTable";

const LogTableTabs = ({ logs }: { logs: ProductLog[] }) => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);

  const groupedLogs = React.useMemo(() => {
    const sortedLogs = [...logs].sort((a, b) => {
      return (
        new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
      );
    });

    return sortedLogs.reduce<Record<string, ProductLog[]>>((acc, log) => {
      const key = log.type;
      if (!acc[key]) acc[key] = [];
      acc[key].push(log);
      return acc;
    }, {});
  }, [logs]);

  const tabKeys = ["Import", "Export", "BreakBox"].filter(
    (key) => key in groupedLogs
  );

  const tabLabels: Record<string, string> = {
    Import: "Nhập kho",
    Export: "Xuất kho",
    BreakBox: "Tách hộp",
  };

  const importExportHeaders = [
    { id: "quantity", label: "Số lượng", align: "center" },
    { id: "type", label: "Nhập/Xuất", align: "center", format: "type" },
    { id: "createDate", label: "Thời gian", align: "center", format: "date" },
  ];

  const headerByType: Record<string, any[]> = {
    Import: importExportHeaders,
    Export: importExportHeaders,
    BreakBox: [
      { id: "quantity", label: "Số lượng tách", align: "center" },
      { id: "createDate", label: "Ngày tách", align: "center", format: "date" },
      { id: "type", label: "Loại", align: "center", format: "type" },
    ],
  };

  const currentTabKey = tabKeys[tabIndex];
  const data = groupedLogs[currentTabKey] || [];
  const headers = headerByType[currentTabKey] || [];

  const dataToDisplay = React.useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, page, pageSize]);

  const handleChangePage = (_: any, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (_: any, newValue: number) => {
    setTabIndex(newValue);
    setPage(0);
  };

  return (
    <Box>
      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ px: "16px" }}>
        {tabKeys.map((key) => (
          <Tab key={key} label={tabLabels[key] || key} />
        ))}
      </Tabs>
      <Box mt={2}>
        <CTable
          tableHeaderTitle={headers}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          total={data.length}
          size={pageSize}
          page={page}
          data={dataToDisplay}
        />
      </Box>
    </Box>
  );
};
export default LogTableTabs;
