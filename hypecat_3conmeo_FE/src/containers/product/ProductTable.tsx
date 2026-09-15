/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

// MUI
import { Box, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// library
import { toast } from "react-toastify";

// Components
//import IntroTour from "@/components/intro/IntroTour";
import MenuActionTableProduct from "../menu_action/Product/MenuActionProduct";

// Hooks & API
import useDebounce from "../../hooks/useDebounce";
import productApi from "../../api/services/ProductApi/productAPI";
import type { Product } from "../../types/ProductType";
import CTable from "../../components/table/CTable";
import { useNavigate } from "react-router-dom";
import config from "../../configs";

// Types
interface SearchToolProps {
  filter: any;
  setFilter: any;
}

const SearchTool: React.FC<SearchToolProps> = ({ filter, setFilter }) => {
  return (
    <Box sx={{ p: 2 }}>
      <TextField
        label="Tìm kiếm"
        variant="outlined"
        size="small"
        id="search-order"
        onChange={(e) => setFilter({ ...filter, SearchTerm: e.target.value })}
      />
    </Box>
  );
};

const ProductTable = () => {
  //Define the state for products
  const [products, setProducts] = React.useState<Product[]>([]);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [totalItemsCount, setTotalItemsCount] = React.useState<number>(0);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const [filter, setFilter] = React.useState<any>({ SearchTerm: "" });
  const debounce = useDebounce(filter, 0);
  const navigate = useNavigate();

  //Call the API to get the products
  const getProducts = async () => {
    try {
      const res: any = await productApi.getProductList({
        ...filter,
        pageIndex,
        pageSize,
        totalItemsCount,
      });
      setProducts(res.items);
      setTotalItemsCount(res.totalItemsCount);
    } catch (error) {
      toast.error("Lấy sản phẩm thất bại");
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  React.useEffect(() => {
    getProducts();
  }, [pageIndex, pageSize, debounce]);

  //select data
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageIndex(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageIndex(0);
  };

  const handleProductRowClick = (row: Product) => {
    navigate(
      config.adminRoutes.ManageProductDetail.replace(":id", row.id.toString())
    );
  };
  const tableHeaderTitle = [
    {
      id: "cover",
      label: "Hình ảnh",
      align: "center",
      format: "image",
    },
    {
      id: "name",
      label: "Tên sản phẩm",
      align: "center",
    },
    {
      id: "createDate",
      label: "Ngày tạo",
      align: "center",
      format: "date",
    },
    {
      id: "isDeleted",
      label: "Trạng thái",
      align: "center",
      format: "deleted",
    },
  ];

  const createProduct = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Button
          id="create-order-btn"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            navigate(config.adminRoutes.CreateProduct);
          }}
        >
          Tạo sản phẩm
        </Button>
      </Box>
    );
  };

  const menuAction = (row: Product) => (
    <MenuActionTableProduct
      product={row}
      isDeleted={selectedRow?.isDeleted as boolean}
      fetchProduct={getProducts}
      introId="menu-action"
    />
  );
  return (
    <div>
      <CTable
        tableHeaderTitle={tableHeaderTitle}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        total={totalItemsCount}
        size={pageSize}
        page={pageIndex}
        searchTool={<SearchTool filter={filter} setFilter={setFilter} />}
        menuAction={(row) => menuAction(row)}
        eventAction={createProduct()}
        selectedData={(row: Product) => setSelectedRow(row)}
        data={products}
        title="Danh sách sản phẩm"
        responsiveConfig={{
          hideFormatsOnMobile: ["datetime", "price", "boolean", "date"], // Hide these formats on mobile
          hideFormatsOnTablet: ["datetime"], // Hide these formats on tablet
        }}
        onRowClick={handleProductRowClick}
      />
    </div>
  );
};
export default ProductTable;
