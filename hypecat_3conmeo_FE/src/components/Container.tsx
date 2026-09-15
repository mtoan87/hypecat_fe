import React, { type ReactNode } from "react";
import { Container } from "@mui/material";

interface ContainerWrapperType {
  children: ReactNode;
}

const ContainerWrapper: React.FC<ContainerWrapperType> = ({ children }) => {
  return (
    <>
      <Container
        sx={{
          maxWidth: "none !important",
          minHeight: "100vh",
        }}
      >
        <>{children}</>
      </Container>
    </>
  );
};

export default ContainerWrapper;
