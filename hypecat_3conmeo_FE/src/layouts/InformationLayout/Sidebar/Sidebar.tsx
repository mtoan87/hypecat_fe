// src/components/layout/Sidebar.tsx
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  Collapse,
  Divider,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation, useNavigate } from "react-router-dom";
import { menuItems } from "./MenuItems";
import { useState } from "react";

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setExpanded(false); // Đóng menu sau khi navigate trên mobile
    }
  };

  if (isMobile) {
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 0,
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          position: "sticky",
          top: 0,
          zIndex: 1100,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          onClick={handleToggle}
          sx={{
            cursor: "pointer",
            p: 2,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            transition: "background-color 0.2s ease",
          }}
        >
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                backgroundColor: theme.palette.primary.main,
                fontSize: "1.2rem",
                fontWeight: 600,
              }}
            >
              HT
            </Avatar>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
            >
              Houang Gia Thành
            </Typography>
          </Box>
          <IconButton
            size="small"
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout={300}>
          <Divider />
          <List sx={{ py: 1 }}>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                  },
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color:
                      location.pathname === item.path ? "white" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        height: "100vh",
        position: "sticky",
        top: 0,
        borderRadius: 0,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Desktop User Profile */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              backgroundColor: theme.palette.primary.main,
              fontSize: "1.3rem",
              fontWeight: 600,
            }}
          >
            HT
          </Avatar>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
            >
              Houang Gia Thành
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý thông tin
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ py: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => handleNavigate(item.path)}
            sx={{
              mx: 2,
              mb: 1,
              borderRadius: 2,
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: "white",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
              },
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color:
                  location.pathname === item.path
                    ? "white"
                    : theme.palette.text.secondary,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 500,
                fontSize: "0.95rem",
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default Sidebar;
