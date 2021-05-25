import React, { useRef, useState } from "react";
import Sketch from "react-p5";
import styled from "styled-components";
import FontFile from "../../Assets/Fonts/NHaasGroteskDSPro-55Rg.ttf";
import { LinkText } from "../../Models/TextLinkModel";
import MenStaring from '../../Assets/Videos/MEN_STARING.mp4'
import Particle from "../Modal/Particle";
const SketchState = {
  HOME_PAGE: "HOME_PAGE"
};

const SketchWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
const UbuntuSketch = props => {
  const wrapperRef = useRef(null);

  let font;
  let fontSize = 200;

  let video;
  let capture;

  let width = 0;
  let height = 0;
  let particles = []


  let selectedWord = "SOME TEXT";

  let state = SketchState.HOME_PAGE;

  const preload = p5 => {
    font = p5.loadFont(FontFile);
    video = p5.createVideo([MenStaring])
    video.hide();
  };

  const setup = (p5, canvasParentRef) => {
    width = p5.windowWidth;
    height = p5.windowHeight;
    p5.pixelDensity(1);
    p5.createCanvas(width, height).parent(canvasParentRef);
    setupText(p5);
    setupCapture(p5);
    for (var i = 0; i < 100; i++) {
      particles[i] = new Particle(p5.random(width), p5.random(height), p5, capture);
    }

    // video.loop();
    // video.speed(0.5)
  };

  const setupCapture = (p5) => {
    capture = p5.createCapture(p5.VIDEO);
    capture.size(width/16, height/16);
  }

  const setupText = p5 => {
    state = SketchState.HOME_PAGE;
    // scrollXPos = 0;
    p5.fill(0, 0, 255);
    p5.textFont(font);
    p5.textSize(fontSize);
    p5.textAlign(p5.LEFT, p5.BASELINE);
  };

  const drawText = p5 => {
    p5.text(selectedWord, 0, height / 2);
  };


  const draw = p5 => {
    // p5.background(255, 0, 0);
    p5.background(0);

    if (state == SketchState.HOME_PAGE) {
    //   p5.image(video, 0, 0, width, height);
        // p5.fill('rgba(0,255,0, 0.25)');
      // p5.image(capture, 0,0,width, height);
      capture.loadPixels();
      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].show();
      }
      // p5.filter(p5.INVERT);
      // drawText(p5);
      
    }
  };

  return (
    <SketchWrapper ref={wrapperRef} >
      <Sketch preload={preload} setup={setup} draw={draw} />
    </SketchWrapper>
  );
};

export default UbuntuSketch;
