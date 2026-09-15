import { m, type MotionProps } from "framer-motion";
// @mui
import { Box, type BoxProps } from "@mui/material";
//

// ----------------------------------------------------------------------

type Props = BoxProps & MotionProps;

interface TextAnimateProps extends Props {
  text: string;
}

export default function TextAnimate({ text, sx, ...other }: TextAnimateProps) {
  return (
    <Box
      component={m.h1}
      sx={{
        typography: "h1",
        overflow: "hidden",
        display: "inline-flex",
        ...sx,
      }}
      {...other}
    >
      {text.split("").map((letter, index) => (
        <m.span key={index}>{letter}</m.span>
      ))}
    </Box>
  );
}
