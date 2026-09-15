import { m, AnimatePresence } from "framer-motion";
// @mui
import { Dialog, Box, Paper, type DialogProps } from "@mui/material";
//

// ----------------------------------------------------------------------

export interface Props extends DialogProps {
  variants?: Record<string, unknown>;
  onClose?: VoidFunction;
}

export default function DialogAnimate({
  open = false,

  onClose,
  children,
  sx,
  ...other
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={open}
          onClose={onClose}
          PaperComponent={(props) => (
            <Box
              component={m.div}
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                onClick={onClose}
                sx={{ width: "100%", height: "100%", position: "fixed" }}
              />
              <Paper sx={sx} {...props}>
                {props.children}
              </Paper>
            </Box>
          )}
          {...other}
        >
          {children}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
