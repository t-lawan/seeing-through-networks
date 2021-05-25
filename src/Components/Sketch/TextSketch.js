import React, { useRef, useState } from "react";

import Sketch from "react-p5";
import styled from "styled-components";
import FontFile from "../../Assets/Fonts/NHaasGroteskDSPro-55Rg.ttf";
import Link from '../../Assets/Videos/LINKS_BACKGROUND.mp4'
import { LinkModel, TextBackgroundType, LinkText } from "../../Models/TextLinkModel";
const SketchWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const SketchState = {
  HOME_PAGE: "HOME_PAGE",
  SCROLLING: "SCROLLING"
};

const TextSketch = props => {
  const wrapperRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);
  let font;
  let video;
  let scrollingFont;
  let navigationFont;

  let fontSize = 40;
  let scrollingFontSize = 200;
  let navigationFontSize = 40;
  let scrollSpeed = 10;
  let widthOfFont = 0;

  let scrollXPos = 0;
  let width = 0;
  let height = 0;
  let numOfRows = 2;
  let numOfColumns = 2;

  let widthOfSection = 0;
  let heightOfSection = 0;

  let startPositions = [];

  
  let tx = [0, 50, 100, 20];
  let ty = [100, 10, 40, 80];

  // let text = ["Link", "Node", "Mesh", "Power", "Freedom", "Communication"];
  let text = [
    new LinkModel("Network", TextBackgroundType.LINKS_BACKGROUND, LinkText.NETWORK),
    new LinkModel("Power", TextBackgroundType.BLUE_BACKGROUND, LinkText.POWER),
    new LinkModel("Freedom", TextBackgroundType.BLUE_BACKGROUND, LinkText.FREEDOM),
    new LinkModel("Communication", TextBackgroundType.BLUE_BACKGROUND, LinkText.COMMUNICATION),
  ]
  let currentLink = text[0]
  let selectedWord = currentLink.title;

  let state = SketchState.HOME_PAGE;

  const createTextMap = p5 => {
    for (let i = 0; i < numOfColumns; i++) {
      for (let j = 0; j < numOfRows; j++) {
        let x = (i / numOfColumns) * width;
        let y = (j / numOfRows) * height;

        startPositions.push({
          x: x + p5.random(fontSize * 2, widthOfSection / 2),
          y: y + p5.random(fontSize * 2, heightOfSection)
        });
      }
    }
  };

  const preload = p5 => {
    font = p5.loadFont(FontFile);
    scrollingFont = p5.loadFont(FontFile);
    navigationFont = p5.loadFont(FontFile);
    video = p5.createVideo([Link])
    video.hide();
  };

  const setup = (p5, canvasParentRef) => {
    let current = wrapperRef.current;
    width = p5.windowWidth;
    height = p5.windowHeight;
    widthOfSection = width / numOfColumns;
    heightOfSection = height / numOfRows;
    scrollXPos = width;
    createTextMap(p5);
    p5.createCanvas(width, height).parent(canvasParentRef);
    setupHomeText(p5);
    video.speed(0.25)
    video.loop()
  };

  const update = p5 => {

    //   console.log('UPDATE', n)
    //   console.log('STA', startPositions[0])

    startPositions.forEach((position, index) => {
      let nx = p5.noise(tx[index]);
      let ny = p5.noise(ty[index]);
      let x = 0;
      let y = 0;
      let startX = 0;
      let endX = width;
      let startY = 0;
      let endY = height;

      if(index % 2 == 0) {
        startX = 0;
        endX = width/2;
      } else {
        startX = width/2;
        endX = width;
      }

      if(index < (startPositions.length/2)){
        startY = 0;
        endY = height/2;
      } else {
        startY = height/2;
        endY = height;
      }
      x = p5.map(nx, 0, 1, startX, endX);
      y = p5.map(ny, 0, 1, startY, endY);
      // x = p5.map(nx, 0, 1, 0, 5);
      // y = p5.map(ny, 0, 1, 0, 5);
      startPositions[index].x = x;
      startPositions[index].y = y;
    });

    //   console.log('END', startPositions[0])
    tx = tx.map((val) => {
      return val +=0.0006;
    })
    ty = ty.map((val) => {
      return val +=0.0006;
    })
  };

  const drawText = p5 => {
    startPositions.forEach((position, index) => {
      p5.fill(0, 255, 0);
      // p5.text("Text", position.x, position.y);
      p5.text(text[index].title, position.x, position.y);
    });
  };

  const drawLines = p5 => {
    p5.beginShape(p5.TRIANGLE_STRIP);
    p5.smooth();
    p5.strokeJoin(p5.ROUND);
    p5.strokeWeight(1);
    startPositions.forEach((position, index) => {
      p5.noFill();
      p5.stroke(0, 255, 0);
      p5.curveVertex(position.x, position.y);
    });
    p5.endShape();
  };

  const respondToMousePressedOnHomePage = p5 => {
      // setIsPressed(!isPressed)
      let mouseX = p5.mouseX;
      let mouseY = p5.mouseY;
      let hasSelectedAWord = false;
      startPositions.forEach((position, index) => {
        if (hasSelectedAWord) {
          return;
        }

        let distance = p5.dist(mouseX, mouseY, position.x, position.y);
        if (distance < 150) {
          hasSelectedAWord = true;
          currentLink = text[index];
          selectedWord = text[index].text;
          setupBackButton(p5);

          setupScrollingText(p5);
        }
      })
  };

  const respondToMousePressedOnTextPage = p5 => {
      let mouseX = p5.mouseX;
      let mouseY = p5.mouseY;
      let distance = p5.dist(mouseX, mouseY, 100, height - 50);
      if (distance < 150) {
        state = SketchState.HOME_PAGE;
        scrollXPos = width;
        // setupBackButton(p5)
        // setupScrollingText(p5)
      }
  };

  const setupHomeText = p5 => {
    p5.textFont(font);
    p5.textSize(fontSize);
    p5.textAlign(p5.CENTER, p5.CENTER);
  };

  const setupScrollingText = p5 => {
    state = SketchState.SCROLLING;
    // scrollXPos = 0;
    p5.fill(0, 255, 0);
    p5.textFont(scrollingFont);
    p5.textSize(scrollingFontSize);
    p5.textAlign(p5.LEFT, p5.BASELINE);

    let rect = scrollingFont.textBounds(selectedWord, 0, 0, scrollingFontSize);
    let textWidth = rect.w;
    let t = ((textWidth - width) / scrollSpeed) * p5.deltaTime;

    setTimeout(() => {
      setupHomeText(p5);
      state = SketchState.HOME_PAGE;
    }, t * 1000);
  };

  const drawScrollingText = p5 => {
    setupScrollingText(p5);
    p5.text(selectedWord, scrollXPos, height / 2);
    scrollXPos -= scrollSpeed;
  };

  const setupBackButton = p5 => {
    p5.textFont(navigationFont);
    p5.textSize(navigationFontSize);
    p5.textAlign(p5.CENTER, p5.CENTER);
  };

  const drawBackButton = p5 => {
    setupBackButton(p5);
    p5.fill(0, 255, 0);
    p5.text("BACK", 100, height - 50);
  };

  const draw = p5 => {
    p5.background(0, 0, 255);
    // update(p5);
    if (state == SketchState.HOME_PAGE) {
      update(p5);
      drawText(p5);
      drawLines(p5);
      // respondToMousePressedOnHomePage(p5);
    }

    if (state == SketchState.SCROLLING) {
      renderBackground(p5);
      drawScrollingText(p5);
      drawBackButton(p5);

      // respondToMousePressedOnTextPage(p5);
    }
  };

  const renderBackground = (p5) => {
    switch(currentLink.background){
      case TextBackgroundType.BLUE_BACKGROUND: {
        break;
      }
      case TextBackgroundType.LINKS_BACKGROUND: {
        p5.image(video, 0, 0, width, height);

       break;
      }
      default: {

      }

    }
  }

  const mousePressed = p5 => {
    if (state == SketchState.HOME_PAGE) {
      respondToMousePressedOnHomePage(p5)
    }

    if (state == SketchState.SCROLLING) {
      respondToMousePressedOnTextPage(p5)
    }
  };

  return (
    <SketchWrapper ref={wrapperRef}>
      <Sketch preload={preload} setup={setup} draw={draw} mousePressed={mousePressed} />
    </SketchWrapper>
  );
};

export default TextSketch;
