import React from "react";
import { useTheme } from "@material-ui/core/styles";
import logoLight from "../../assets/logo.png";      // Logo para tema claro
import logoDark from "../../assets/logo-dark.png";  // Logo para tema escuro

const LogoTheme = ({ className, alt = "Logo" }) => {
  const theme = useTheme();
  const logoImage = theme.palette.mode === "light" ? logoLight : logoDark;
  return <img src={logoImage} className={className} alt={alt} />;
};

export default LogoTheme;
