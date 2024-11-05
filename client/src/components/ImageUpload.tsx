import React, { useState } from "react";
import { UploadIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Heading, Text } from "@radix-ui/themes";
import { IImageUpload } from "../interfaces";

const ImageUpload = (props: IImageUpload) => {
  const [isDragging, setIsDragging] = useState(false);

  const { onImageUpload, response, setImageFile } = props;

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageFile(img.src);
        onImageUpload?.(file);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <Box
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onClick={() => document.getElementById("fileInput")?.click()}
    >
      <Flex gap="4" align="center" justify="center" direction="column" py="8">
        <Heading>Upload Image</Heading>
        <Text>
          Please drag and drop the image file or please click the button below
        </Text>
        <Button
          variant="outline"
          loading={response?.loading}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/jpeg, image/png";
            input.onchange = (event) => {
              handleFileInput(event as any);
            };
            input.click();
          }}
        >
          <UploadIcon />
          Upload Image
        </Button>
      </Flex>
    </Box>
  );
};

export default ImageUpload;
