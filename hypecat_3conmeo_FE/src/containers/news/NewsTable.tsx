/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, TextField } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from '@mui/material/CircularProgress';
import CTable from "../../components/table/CTable";
import useDebounce from "../../hooks/useDebounce";
import type { News } from "../../types/NewsType";
import newsAPI from "../../api/services/NewsApi/newsAPI";
import MenuActionTableNews from "../menu_action/News/MenuActionNews";
import { useNavigate } from "react-router-dom";
import config from "../../configs";

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
                id="search-category"
                onChange={(e) => setFilter({ ...filter, SearchTerm: e.target.value })}
            />
        </Box>
    );
};

// const categoryTableIntroSteps = [
//   {
//     element: "#intro-category-table",
//     title: "Bảng loại sản phẩm",
//     intro: "Đây là danh sách các loại sản phẩm.",
//     position: "left",
//   },
//   {
//     element: "#name-header",
//     title: "Cột loại sản phẩm",
//     intro: "Loại sản phẩm.",
//     position: "left",
//   },
//   {
//     element: "#deleted-header",
//     title: "Cột Trạng thái",
//     intro: "Trạng thái của loại sản phẩm.",
//     position: "left",
//   },
//   {
//     element: "#menu-action",
//     title: "Nút hành động",
//     intro:
//       "Nhấn vào đây để thực hiện các hành động trên loại sản phẩm đã chọn.",
//     position: "left",
//   },
//   {
//     element: "#search-category",
//     title: "Thanh tìm kiếm",
//     intro: "Nhập vào đây để tìm kiếm loại sản phẩm",
//     position: "right",
//   },
//   {
//     element: "#create-category-btn",
//     title: "Tạo loại sản phẩm",
//     intro: "Nhấn vào đây để thêm loại sản phẩm mới.",
//     position: "left",
//   },
// ];
const NewsTable = () => {
    //Define the state for categories
    const [news, setNews] = React.useState<News[]>([]);
    const [pageIndex, setPageIndex] = React.useState<number>(0);
    const [pageSize, setPageSize] = React.useState<number>(10);
    const [totalItemsCount, setTotalItemsCount] = React.useState<number>(0);
    const [selectedRow, setSelectedRow] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [filter, setFilter] = React.useState<any>({ SearchTerm: "" });
    const debounce = useDebounce(filter, 0);
    const navigate = useNavigate();

    //Call the API to get the products
    const getNews = async () => {
        try {
            setIsLoading(true);
            const res: any = await newsAPI.getNewsList({
                ...filter,
                pageIndex,
                pageSize,
                totalItemsCount,
            });
            setNews(
                res.items.map((item: any) => ({
                    ...item,
                    cover: [{ urlPath: item.cover }],
                }))
            );
            setTotalItemsCount(res.totalItemsCount);
        } catch (error) {
            toast.error("Lấy tin tức thất bại");
            console.error("Lỗi khi lấy danh sách tin tức:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        getNews();
    }, [pageIndex, pageSize, debounce]);

    if (isLoading) {
        return <CircularProgress />;
    }

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

    const tableHeaderTitle = [
        {
            id: "cover",
            label: "Hình ảnh",
            align: "center",
            format: "images",
        },
        {
            id: "title",
            label: "Chủ đề",
            align: "center",
            introId: "name-header",
        },
        {
            id: "writer",
            label: "Người viết",
            align: "center",
            introId: "cate-type-header",
        },
        {
            id: "category.name",
            label: "Thể loại",
            align: "center",
            introId: "deleted-header",
        },
        {
            id: "isDeleted",
            label: "Trạng thái",
            align: "center",
            format: "deleted",
        },
    ];

    const createNews = () => {
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
                    id="create-category-btn"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(config.adminRoutes.createNews)}
                >
                    Tạo thông báo
                </Button>
            </Box>
        );
    };

    const menuAction = (row: News) => (
        <MenuActionTableNews
            newsData={row}
            isDeleted={selectedRow?.isDeleted as boolean}
            fetchNews={getNews}
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
                menuAction={(row: News) => menuAction(row)}
                eventAction={createNews()}
                selectedData={(row: News) => setSelectedRow(row)}
                data={news}
                title="Danh sách thông báo"
            />
        </div>
    );
};
export default NewsTable;
