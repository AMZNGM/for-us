"use client";

import { useEffect } from "react";

const banner = `
      ▌              ▌
▛▛▌▀▌▛▌█▌ with love  ▛▌▌▌
▌▌▌█▌▙▌▙▖ with love  ▙▌▙▌
                       ▄▌

███  ██  ▄████  ██▄  ▄██
██ ▀▄██ ██  ▄▄▄ ██ ▀▀ ██
██   ██  ▀███▀  ██    ██
`;

export default function Banner() {
  useEffect(() => {
    console.log(`%c${banner}`, "color:#00eaff");
  }, []);

  return null;
}
