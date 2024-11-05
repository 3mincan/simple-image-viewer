import { useEffect } from "react";
import { Theme } from "@radix-ui/themes";
import { ThemeProps } from "@radix-ui/themes/dist/cjs/";

export const ThemeProvider: React.FC<ThemeProps> = ({ children, ...props }) => {
  useEffect(() => {
    switch (props.appearance) {
      case "light": {
        if (document?.body) {
          document.body.classList.remove("light", "dark");
          document.body.classList.add("light");
        }
        break;
      }
      case "dark": {
        if (document?.body) {
          document.body.classList.remove("light", "dark");
          document.body.classList.add("dark");
        }
        break;
      }
    }
  }, [props.appearance]);

  return (
    <Theme accentColor="green" radius="full" {...props}>
      <>{children}</>
    </Theme>
  );
};
