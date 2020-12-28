import React, { useEffect, useState } from "react";
import { Button, Typography } from '@material-ui/core';

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);

  useEffect(() => {
    const handler = e => {
      e.preventDefault();
      console.log("PWA supported");
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const onClick = evt => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };
  if (!supportsPWA) {
      console.log("PWA Not supported")
    return null;
  }
  return (
    <>
     <Typography variant="body1" gutterBottom >
                    You can also install this as a Progressive Web App by installing it on your home screen.
                </Typography>
                <Button variant="contained"onClick={onClick} >Install on Home Screen</Button>
    </>
  );
};

export default InstallPWA;