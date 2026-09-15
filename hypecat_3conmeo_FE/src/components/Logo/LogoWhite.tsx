import React from "react";
import images from "../../constants/images";
import "./Logo.scss";

interface LogoProps {
  style?: React.CSSProperties;
}
const LogoWhite: React.FC<LogoProps> = ({ style }) => {
  return (
    <img
      className="logoWhite"
      alt="icon"
      src={images.whiteLogo}
      style={style}
    />
  );
};

export default LogoWhite;
