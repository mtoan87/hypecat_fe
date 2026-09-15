import { useState } from "react";
import { Chip } from "@mui/material";
import type { BatchDetail } from "../../types/BatchType";
import CTable from "../../components/table/CTable";

const BatchProductTable = ({
  batchDetails,
}: {
  batchDetails: BatchDetail[];
}) => {
  // State declarations with proper typing
  const [size, setSize] = useState<number>(10);
  const total = batchDetails.length;
  const [page, setPage] = useState<number>(0);

  // Table headers configuration
  const tableHeader = [
    {
      id: "batchId",
      label: "Số lô",
      align: "center" as const,
      minWidth: 120,
      maxWidth: 140,
      render: (value: string) => (
        <Chip
          label={value}
          size="small"
          variant="outlined"
          sx={{
            fontFamily: "monospace",
            fontSize: "0.7rem",
            maxWidth: "120px",
            "& .MuiChip-label": {
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          }}
          title={value}
        />
      ),
    },

    {
      id: "quantity",
      label: "SL ban đầu",
      align: "center" as const,
      minWidth: 90,
    },
    {
      id: "remainingQuantity",
      label: "SL còn lại",
      align: "center" as const,
      minWidth: 90,
    },
    {
      id: "createDate",
      label: "Ngày nhập kho",
      align: "center" as const,
      minWidth: 90,
      format: "date",
    },
  ];

  // Handle pagination change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newSize = parseInt(event.target.value, 10);
    setSize(newSize);
    setPage(0); // Reset to first page when changing page size
  };

  // Calculate the paginated batch details
  const firstIndex = page * size;
  const lastIndex = firstIndex + size;
  const pagedBatchDetails = batchDetails.reverse().slice(firstIndex, lastIndex);

  return (
    <>
      <CTable
        data={pagedBatchDetails}
        tableHeaderTitle={tableHeader}
        title="Bảng quản lý lô hàng"
        size={size}
        page={page}
        total={total}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        hideRowsPerPageOptions={true}
      />
    </>
  );
};

export default BatchProductTable;
