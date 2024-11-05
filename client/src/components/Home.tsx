import React, { useEffect, useState } from "react";
import { Box, Card, Flex, Heading } from "@radix-ui/themes";
import { AlertBox, ImageComponent, Showcase, ImageUpload } from ".";
import { IResponse, IImage } from "../interfaces";

const Home = () => {
  const [imageFile, setImageFile] = useState("");
  const [imageLibrary, setImageLibrary] = useState<IImage[] | null>(null);
  const [response, setResponse] = useState<IResponse>({
    message: "",
  });

  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/files");
      const data = await response.json();
      setImageLibrary(data);
    } catch (error) {
      setResponse({
        message: "Server error",
        loading: false,
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setImageFile(URL.createObjectURL(file));
    setResponse({
      message: "",
      loading: true,
    });
    const response = await fetch("http://localhost:4000/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setResponse({
      message: data.message,
      loading: false,
    });
    fetchImages();
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <>
      {response?.message !== "" && <AlertBox message={response.message} />}
      {response?.message !== "Server error" && (
        <Flex
          px={{
            initial: "4",
            md: "0",
          }}
          py="4"
          direction={{
            initial: "column",
            md: "row",
          }}
          gap="4"
        >
          <Box
            width={{
              initial: "100%",
              md: "50%",
            }}
            id="fileInput"
          >
            <Card>
              <ImageUpload
                onImageUpload={handleImageUpload}
                response={response}
                setImageFile={setImageFile}
              />
            </Card>
          </Box>

          <Box
            width={{
              initial: "100%",
              md: "50%",
            }}
          >
            <Card>
              <Flex gap="4" align="center" direction="column" py="8">
                {imageLibrary && imageLibrary.length > 0 ? (
                  <>
                    <Showcase imageLibrary={imageLibrary} />
                  </>
                ) : (
                  <Flex justify="center" py="4">
                    <Heading>No images to display</Heading>
                  </Flex>
                )}
              </Flex>
            </Card>
          </Box>
        </Flex>
      )}
      {imageFile !== "" && (
        <ImageComponent
          imageFile={imageFile}
          setImageFile={setImageFile}
          setResponse={setResponse}
        />
      )}
    </>
  );
};

export default Home;
