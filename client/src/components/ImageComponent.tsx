import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { IHistory, IImageComponent, ITransformation } from "../interfaces";

const ImageComponent = (props: IImageComponent) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const positionRef = useRef<{
    startX: number;
    startY: number;
  }>({ startX: 0, startY: 0 });
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [history, setHistory] = useState<IHistory>({
    past: [],
    present: {
      zoom: 1,
      rotate: 0,
      flipHorizontal: false,
      flipVertical: false,
    },
    future: [],
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#FF0000");
  const { imageFile, setImageFile, setResponse } = props;

  const screenWidth = window.innerWidth;

  const commonColors = [
    { color: "#FF0000", name: "Red" },
    { color: "#00FF00", name: "Green" },
    { color: "#0000FF", name: "Blue" },
    { color: "#000000", name: "Black" },
    { color: "#FFFFFF", name: "White" },
  ];

  const fitImageToContainer = (
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ) => {
    const aspectRatio = originalWidth / originalHeight;
    let width = originalWidth;
    let height = originalHeight;

    if (originalWidth > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return { width, height };
  };

  const changeZoom = (direction: string) => {
    const newTransformation = {
      ...history.present,
      zoom:
        direction === "in"
          ? history.present.zoom + 0.1
          : history.present.zoom - 0.1,
    };
    updateHistory(newTransformation);
  };

  const flipImage = (type: string) => {
    const newTransformation = {
      ...history.present,
      [type === "horizontal" ? "flipHorizontal" : "flipVertical"]:
        !history.present[
          type === "horizontal" ? "flipHorizontal" : "flipVertical"
        ],
    };
    updateHistory(newTransformation);
  };

  const rotateImage = () => {
    const newTransformation = {
      ...history.present,
      rotate:
        history.present.rotate + 90 >= 360 ? 0 : history.present.rotate + 90,
    };
    updateHistory(newTransformation);
  };

  const resetImage = () => {
    const defaultTransformation = {
      zoom: 1,
      rotate: 0,
      flipHorizontal: false,
      flipVertical: false,
    };

    setHistory({
      past: [],
      present: defaultTransformation,
      future: [],
    });
  };

  const updateHistory = (newState: ITransformation) => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: newState,
      future: [],
    }));
  };

  const undo = () => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  };

  const redo = () => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  };

  const getMousePosition = (
    canvas: HTMLCanvasElement,
    evt: React.MouseEvent
  ) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const pos = getMousePosition(canvas, e);
    positionRef.current = { startX: pos.x, startY: pos.y };
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!isDrawing || !canvas || !ctx) return;

    const pos = getMousePosition(canvas, e);

    ctx.beginPath();
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctx.moveTo(positionRef.current.startX, positionRef.current.startY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    positionRef.current = { startX: pos.x, startY: pos.y };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    const img = new Image();
    img.src = imageFile;
    img.onload = () => {
      setImage(img);
    };
  }, [imageFile]);

  useEffect(() => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = fitImageToContainer(
      image.width,
      image.height,
      screenWidth < 768 ? 400 : 600,
      screenWidth < 768 ? 400 : 600
    );

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((history.present.rotate * Math.PI) / 180);
    ctx.scale(
      history.present.flipHorizontal ? -1 : 1,
      history.present.flipVertical ? -1 : 1
    );

    ctx.drawImage(
      image,
      -width / 2,
      -height / 2,
      width * history.present.zoom,
      height * history.present.zoom
    );

    ctx.restore();
  }, [image, history, screenWidth]);

  const actions = [
    {
      name: "Undo",
      action: undo,
    },
    {
      name: "Redo",
      action: redo,
    },
    {
      name: "Remove Image",
      action: () => {
        setImageFile("");
        setResponse({
          message: "",
        });
      },
    },
    {
      name: "Reset",
      action: resetImage,
    },
  ];

  return (
    <Card
      my="4"
      mx={{
        initial: "4",
        md: "0",
      }}
    >
      <Flex justify="center" py="4">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        ></canvas>
      </Flex>
      <Flex
        justify="center"
        direction={{
          initial: "column",
          sm: "row",
        }}
        gap="4"
        py="2"
      >
        {commonColors.map(({ color, name }) => (
          <Button
            key={color}
            onClick={() => setCurrentColor(color)}
            style={{ backgroundColor: color }}
          >
            {currentColor === color ? "selected" : ""}
          </Button>
        ))}
      </Flex>
      <Flex
        justify="center"
        direction={{
          initial: "column",
          sm: "row",
        }}
        gap="4"
        py="2"
      >
        <Flex
          align="center"
          justify="center"
          direction="row"
          gap="1"
          width={{
            initial: "100%",
            sm: "auto",
          }}
        >
          <Button variant="outline" onClick={() => changeZoom("in")}>
            +
          </Button>
          <Text color="green" size="2" weight="bold">
            Zoom
          </Text>
          <Button variant="outline" onClick={() => changeZoom("out")}>
            -
          </Button>
        </Flex>
        <Button variant="outline" onClick={rotateImage}>
          Rotate
        </Button>
        <Button variant="outline" onClick={() => flipImage("horizontal")}>
          Flip Horizontal
        </Button>
        <Button variant="outline" onClick={() => flipImage("vertical")}>
          Flip Vertical
        </Button>
      </Flex>
      <Flex justify="center" direction="row" gap="4" py="2">
        {actions.map(({ name, action }) => (
          <Button key={name} variant="outline" onClick={action}>
            {name}
          </Button>
        ))}
      </Flex>
    </Card>
  );
};

export default ImageComponent;
