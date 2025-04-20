'use client';
import { createTheme } from '@mui/material/styles';
import { Shadows_Into_Light } from "next/font/google";


const shadowsIntoLight = Shadows_Into_Light({
    variable: "--font-shadows-into-light",
    weight: "400",
    subsets: ["latin"],
    display: "swap"
  })

const theme = createTheme({
  typography: {
    fontFamily: shadowsIntoLight.style.fontFamily,
  },
});

export default theme;
