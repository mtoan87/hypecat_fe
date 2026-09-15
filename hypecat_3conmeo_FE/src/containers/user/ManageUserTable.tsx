/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddUser from "./popup/AddUserDialog";
import type { UserData } from "../../types/Usertype";
import userApi from "../../api/services/user_api/userAPI";
import CTable from "../../components/table/CTable";
import MenuActionUser from "../menu_action/User/MenuActionUser";
import { useNavigate } from "react-router-dom";
import config from "../../configs";

interface STProps {
  filter: any;
  setFilter: any;
}

const SearchTool: React.FC<STProps> = ({ filter, setFilter }) => {
  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TextField
        size="small"
        placeholder="Tìm kiếm"
        label="Khách hàng"
        id="intro-search-user"
        onChange={(e) => setFilter({ ...filter, SearchTerm: e.target.value })}
        sx={{ minWidth: 200 }}
      />

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="delete-status-label">Trạng thái xóa</InputLabel>
        <Select
          labelId="delete-status-label"
          id="delete-status-select"
          value={filter.IsDeleted ?? ""}
          label="Trạng thái xóa"
          onChange={(e) => {
            const value = e.target.value;
            setFilter({
              ...filter,
              IsDeleted: value === "" ? undefined : value === "true",
            });
          }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="false">Chưa xóa</MenuItem>
          <MenuItem value="true">Đã xóa</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

const ManageUserTable = () => {
  //define state
  const [usersData, setUsersData] = React.useState<UserData[]>();
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    SearchTerm: "",
    isDelete: undefined,
  });
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const navigate = useNavigate();

  //call api
  const getListUsers = async () => {
    const RoleId = 2;

    try {
      const data: any = await userApi.getListUsers({
        ...filter,
        pageIndex,
        pageSize,
        RoleId,
      });
      setUsersData(data.items);
      setTotal(data.totalItemsCount);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };
  React.useEffect(() => {
    getListUsers();
  }, [pageIndex, pageSize, filter]);

  //Handle pagination
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

  const handleRowClickDetail = (row: UserData) => {
    navigate(config.adminRoutes.detailUser.replace(":id", row.id.toString()));
  };
  //title header
  const tableHeaderTitle = [
    {
      id: "name",
      label: "Tên người dùng",
      align: "center",
      introId: "name-header",
    },
    { id: "email", label: "Email", align: "center", introId: "email-header" },
    {
      id: "phone",
      label: "Số điện thoại",
      align: "center",
      introId: "phone-header",
    },
    {
      id: "role.roleName",
      label: "Vai trò",
      align: "center",
      introId: "role-header",
    },
    {
      id: "status",
      label: "Trạng thái",
      align: "center",
      format: "status",
      introId: "status-header",
    },
  ];

  //handle open add popup
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //select data
  const selectedData = (row: any) => {
    setSelectedRow(row);
  };

  const EventAction = () => {
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
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          id="intro-create-user"
          sx={(theme) => ({
            [theme.breakpoints.down("mobile")]: {
              fontSize: 10,
            },
          })}
        >
          Thêm người dùng
        </Button>
      </Box>
    );
  };
  const SearchEvent = () => {
    return (
      <>
        <Box>
          <SearchTool filter={filter} setFilter={setFilter} />
        </Box>
      </>
    );
  };
  return (
    <div>
      <AddUser open={open} handleClose={handleClose} fetchData={getListUsers} />
      <CTable
        data={usersData}
        searchTool={<SearchEvent />}
        title="Danh sách người dùng"
        tableHeaderTitle={tableHeaderTitle}
        eventAction={<EventAction />}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        selectedData={selectedRow}
        page={pageIndex}
        size={pageSize}
        total={total}
        menuAction={(row) => (
          <MenuActionUser
            userData={row}
            fetchData={getListUsers}
            onOpenDelete={() => selectedData(row)}
          />
        )}
        onRowClick={handleRowClickDetail}
      />
    </div>
  );
};

export default ManageUserTable;
