import React, { useRef, useState } from "react";
import Sketch from "react-p5";
import styled from "styled-components";
import FontFile from "../../Assets/Fonts/NHaasGroteskDSPro-55Rg.ttf";
import { LinkText } from "../../Models/TextLinkModel";
import MenStaring from '../../Assets/Videos/MEN_STARING.mp4'
import MontPelerin from '../../Assets/Videos/MONT_PELERIN.mp4'

const SketchState = {
  HOME_PAGE: "HOME_PAGE",
  SCROLLING: "SCROLLING",
  VIDEO: "VIDEO"
};

export const VideoFiles = {
  MONT_PELERIN: MontPelerin
}


const SketchWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const VideoSketch = props => {
  const wrapperRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);

  let scrollingFont;
  let navigationFont;

  let scrollingFontSize = 200;
  let navigationFontSize = 40;
  let scrollSpeed = 10;

  let video;

  let scrollXPos = 0;
  let width = 0;
  let height = 0;


  let selectedWord = LinkText.MONT_PELERIN;

  let state = SketchState.SCROLLING;

  const preload = p5 => {
    scrollingFont = p5.loadFont(FontFile);
    navigationFont = p5.loadFont(FontFile);
    video = p5.createVideo([VideoFiles.MONT_PELERIN])
    video.hide();
  };

  const setup = (p5, canvasParentRef) => {
    width = p5.windowWidth;
    height = p5.windowHeight;
    scrollXPos = width;
    p5.createCanvas(width, height).parent(canvasParentRef);
    setupScrollingText(p5);
    video.loop();
    // video.speed(0.5)
  };

  const setupScrollingText = p5 => {
    state = SketchState.SCROLLING;
    // scrollXPos = 0;
    p5.fill(0, 0, 255);
    p5.textFont(scrollingFont);
    p5.textSize(scrollingFontSize);
    p5.textAlign(p5.LEFT, p5.BASELINE);
  };

  const drawScrollingText = p5 => {
    p5.text(selectedWord, scrollXPos, height / 2);
    scrollXPos -= scrollSpeed;
  };


  const draw = p5 => {
    p5.background(0, 255, 0);

    if (state == SketchState.SCROLLING) {
      p5.image(video, 0, 0, width, height);
      // p5.filter(p5.INVERT);
      drawScrollingText(p5);
      
    }
  };

  return (
    <SketchWrapper ref={wrapperRef}>
      <Sketch preload={preload} setup={setup} draw={draw} />
    </SketchWrapper>
  );
};

export default VideoSketch;
