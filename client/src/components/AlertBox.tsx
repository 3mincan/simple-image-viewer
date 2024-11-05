import React from "react";
import { Callout } from "@radix-ui/themes";
import {
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { IResponse } from "../interfaces";

const AlertBox = (props: IResponse) => {
  const { message } = props;

  return (
    <Callout.Root
      color={message?.includes("error") ? "red" : "green"}
      mx={{
        initial: "4",
        md: "0",
      }}
    >
      <Callout.Icon>
        {message?.includes("error") ? (
          <ExclamationTriangleIcon />
        ) : (
          <InfoCircledIcon />
        )}
      </Callout.Icon>
      <Callout.Text color={message?.includes("error") ? "red" : "green"}>
        {message}
      </Callout.Text>
    </Callout.Root>
  );
};

export default AlertBox;
