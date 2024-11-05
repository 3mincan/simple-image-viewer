import React, { useState } from "react";
import { Box, Button, Flex, Grid, Heading } from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { IShowcase } from "../interfaces";

const Showcase = (props: IShowcase) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { imageLibrary } = props;

  const createImageLibraryPages = () => {
    const itemsPerPage = 12;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    return imageLibrary?.slice(startIndex, endIndex);
  };

  return (
    <>
      <Box width="100%">
        <Flex
          width="100%"
          justify={{
            initial: "center",
            sm: "between",
          }}
          align={{
            initial: "center",
            sm: "start",
          }}
          py="4"
          px={{
            initial: "4",
            sm: "8",
          }}
          gap="4"
          direction={{
            initial: "column",
            sm: "row",
          }}
        >
          <Heading>Uploaded Images</Heading>
          <Flex gap="4">
            <Button
              variant="outline"
              onClick={() => {
                currentPage > 1 && setCurrentPage(currentPage - 1);
              }}
            >
              <ChevronLeftIcon />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                imageLibrary?.length! > currentPage * 12 &&
                  setCurrentPage(currentPage + 1);
              }}
            >
              Next
              <ChevronRightIcon />
            </Button>
          </Flex>
        </Flex>
      </Box>

      <Grid
        columns={{
          initial: "repeat(2, 100px)",
          sm: "repeat(6, 100px)",
          md: "repeat(4, 100px)",
        }}
        gap="4"
        width="auto"
        align="center"
        justify="center"
        py="4"
      >
        {createImageLibraryPages()?.map((image, index) => (
          <AspectRatio.Root ratio={image.width / image.height}>
            <img
              src={`http://localhost:4000/${image.url}`}
              alt={image.name}
              key={index}
              height={image.height > image.width ? "auto" : "100%"}
              width={image.width > image.height ? "auto" : "100%"}
            />
          </AspectRatio.Root>
        ))}
      </Grid>
    </>
  );
};

export default Showcase;
