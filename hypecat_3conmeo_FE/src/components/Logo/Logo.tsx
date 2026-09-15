import React from "react";
import images from "../../constants/images";
import "./Logo.scss";

interface LogoProps {
  style?: React.CSSProperties;
}
const Logo: React.FC<LogoProps> = ({ style }) => {
  return <img className="logo" alt="icon" src={images.logo} style={style} />;
};

export default Logo;
