// src/components/layout/InformationLayout.tsx
import { Box, Container, useTheme, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";

const InformationLayout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    if (isMobile) {
        return (
            <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
                {/* Mobile Header/Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <Container
                    maxWidth="xl"
                    sx={{
                        py: 2,
                        px: 2,
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 2,
                            p: 2,
                            minHeight: 'calc(100vh - 120px)',
                            boxShadow: theme.shadows[1],
                        }}
                    >
                        <Outlet />
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            <Box
                sx={{
                    width: { md: '280px', lg: '300px' },
                    flexShrink: 0,
                    position: 'fixed',
                    height: '100vh',
                    zIndex: 1200,
                    top: 0,
                    left: 0,
                }}
            >
                <Sidebar />
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: { md: '280px', lg: '240px' },
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Container
                    maxWidth="xl"
                    sx={{
                        py: 4,
                        px: 4,
                        flexGrow: 1,
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 2,
                            px: 3,
                            minHeight: '100%',
                            boxShadow: theme.shadows[4],
                            marginLeft: 8
                        }}
                    >
                        <Outlet />
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default InformationLayout;