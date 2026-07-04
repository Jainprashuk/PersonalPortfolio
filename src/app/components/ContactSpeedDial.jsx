"use client";

import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";

const actions = [
  { icon: <InstagramIcon />, name: "Instagram", link: "https://www.instagram.com/29prashuk_jain/?igshid=YzVkODRmOTdmMw%3D%3D" },
  { icon: <WhatsAppIcon />, name: "WhatsApp", link: "https://api.whatsapp.com/send/?phone=916265831996&text=Hey+there+%2C+can+we+talk..&type=phone_number&app_absent=0" },
  { icon: <LinkedInIcon />, name: "LinkedIn", link: "https://www.linkedin.com/in/prashuk-jain-937a12212/" },
  { icon: <GitHubIcon />, name: "GitHub", link: "https://github.com/jainprashuk" },
];

export default function ContactSpeedDial() {
  return (
    <Box
      sx={{
        height: 320,
        transform: "translateZ(0px)",
        flexGrow: 1,
        position: "fixed",
        bottom: "0.1rem",
        right: "0.1rem",
      }}
    >
      <div>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
          }}
          icon={<SpeedDialIcon className="text-gray-100 dark:text-gray-900" />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              className="text-gray-100 bg-gray-500 dark:bg-gray-200 dark:text-gray-900"
              onClick={() => window.open(action.link, "_blank")}
            />
          ))}
        </SpeedDial>
      </div>
    </Box>
  );
}
