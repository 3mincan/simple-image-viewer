import React, { useState } from "react";
import { Button, Container, Flex, Heading } from "@radix-ui/themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { ThemeProvider } from "./theme-provider";
import { Home } from "./components";
import "./App.css";

const App = () => {
  const [appearance, setAppearance] = useState<"dark" | "light">("dark");

  const toggle = () => {
    setAppearance(appearance === "dark" ? "light" : "dark");
  };

  return (
    <ThemeProvider appearance={appearance}>
      <Container py="8">
        <Flex
          justify="between"
          py="4"
          px={{
            initial: "4",
          }}
        >
          <Heading>Simple Image Uploader & Viewer</Heading>
          <Button onClick={toggle} variant="outline">
            {appearance === "dark" ? <SunIcon /> : <MoonIcon />}
          </Button>
        </Flex>
        <Home />
      </Container>
    </ThemeProvider>
  );
};

export default App;
