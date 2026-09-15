import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";

export interface TabItem {
    label: string;
    content: React.ReactNode;
}

interface ReusableTabsProps {
    tabs: TabItem[];
    defaultTab?: number;
    sx?: object;
}

export default function CTabs({ tabs, defaultTab = 0, sx }: ReusableTabsProps) {
    const [currentTab, setCurrentTab] = useState(defaultTab);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <Box sx={{ width: "100%", ...sx }}>
            <Tabs
                value={currentTab}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2 }}
            >
                {tabs.map((tab, index) => (
                    <Tab key={index} label={tab.label} />
                ))}
            </Tabs>

            <Box>
                {tabs.map((tab, index) => (
                    <Box key={index} hidden={currentTab !== index} sx={{ p: 2 }}>
                        {currentTab === index && tab.content}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
