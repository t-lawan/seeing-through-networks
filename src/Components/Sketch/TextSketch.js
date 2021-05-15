import React, { useRef, useState } from "react";

import Sketch from "react-p5";
import styled from "styled-components";
import FontFile from "../../Assets/Fonts/NHaasGroteskDSPro-55Rg.ttf";
import { start } from "pretty-error";

class TextItem {

}

const SketchWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const SketchState = {
	HOME_PAGE: 'HOME_PAGE',
	SCROLLING: 'SCROLLING'
}
const TextSketch = props => {
  const wrapperRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);
  let font;
  let scrollingFont;

  let fontSize = 40;
  let scrollingFontSize = 200;
  let widthOfFont = 0;

  let scrollXPos = 0;
  let width = 0;
  let height = 0;
  let numOfRows = 2;
  let numOfColumns = 3;

  let widthOfSection = 0;
  let heightOfSection = 0;

  let startPositions = [];

  let tx = 0;
  let ty = 100;

  let text = ["Link", "Node", "Vibe", "Power", "Freedom", "Communication"];
  let selectedWord = text[0];

  let state = SketchState.HOME_PAGE;

  const createTextMap = p5 => {
    // for(let i = 0;i < numOfColumns * numOfRows; i++) {
    // 	offsetPositions.push({
    // 		x: p5.random(0, widthOfSection/2),
    // 		y: p5.random(0, heightOfSection/2)
    // 	});
    // }

    for (let i = 0; i < numOfColumns; i++) {
      for (let j = 0; j < numOfRows; j++) {
        let x = (i / numOfColumns) * width;
        let y = (j / numOfRows) * height;

        startPositions.push({
          x: x + p5.random(fontSize, widthOfSection / 2),
          y: y + p5.random(fontSize, heightOfSection)
        });
        // p5.fill(0,255,0);
        // p5.text("Text", x + (widthOfSection/2), y+ (heightOfSection/2));
      }
    }
  };

  const preload = p5 => {
	font = p5.loadFont(FontFile);
	scrollingFont = p5.loadFont(FontFile);
  };

  const setup = (p5, canvasParentRef) => {
    let current = wrapperRef.current;
    width = p5.windowWidth;
    height = p5.windowHeight;
    widthOfSection = width / numOfColumns;
    heightOfSection = height / numOfRows;
    createTextMap(p5);
    p5.createCanvas(width, height).parent(canvasParentRef);
	setupHomeText(p5)
  };

  const update = p5 => {
    let nx = p5.noise(tx);
    let ny = p5.noise(ty);
    //   console.log('UPDATE', n)
    //   console.log('STA', startPositions[0])

    startPositions.forEach((position, index) => {
      let x = 0;
	  let y = 0;
	  x = p5.map(nx, 0, 1, 0, width)
	  y = p5.map(ny, 0, 1, 0, height)
	  startPositions[index].x = x;
	  startPositions[index].y = y;
    })

    //   console.log('END', startPositions[0])

    tx += 0.001;
    ty += 0.001;
  };

  const drawText = p5 => {
    startPositions.forEach((position, index) => {
      p5.fill(0, 255, 0);
      // p5.text("Text", position.x, position.y);
      p5.text(text[index], position.x, position.y);
    });
  };

  const drawLines = p5 => {
    p5.beginShape(p5.TRIANGLE_STRIP);
    p5.smooth();
    startPositions.forEach((position, index) => {
      p5.noFill();
      p5.stroke(0, 255, 0);
      p5.curveVertex(position.x, position.y);
    });
    p5.endShape();
  };

  const respondToMousePressedOnHomePage = (p5) => {
    if (p5.mouseIsPressed && !isPressed) {
		// setIsPressed(!isPressed)
		let mouseX = p5.mouseX;
		let mouseY = p5.mouseY;
		let hasSelectedAWord = false;
		startPositions.forEach((position, index) => {
		  if (hasSelectedAWord) {
			return;
		  }
  
		  let distance = p5.dist(mouseX, mouseY, position.x, position.y);
		  console.log("DIST", distance);
		  if (distance < 150) {
			hasSelectedAWord = true;
			selectedWord = ""
			for(let i = 0; i < 10; i++) {
				selectedWord += ` ${text[index]}`
			}
			setupScrollingText(p5)
		  }
		});
	  }
  }

  const setupHomeText = (p5) => {
    p5.textFont(font);
    p5.textSize(fontSize);
    p5.textAlign(p5.CENTER, p5.CENTER);
  }

  const setupScrollingText = (p5) => {
	state = SketchState.SCROLLING;
	scrollXPos = 0;
	p5.fill(0, 255, 0) ;
	p5.textFont(scrollingFont);
    p5.textSize(scrollingFontSize);
	p5.textAlign(p5.LEFT, p5.BASELINE);
	

	let rect = scrollingFont.textBounds(selectedWord, 0, 0, scrollingFontSize)
	let width = rect.w;
	let t = (width/(5 * scrollingFontSize)) + 5;
	console.log('RECT', rect)
	console.log('t', t)

	setTimeout(() => {
		setupHomeText(p5)
		state = SketchState.HOME_PAGE
	}, t * 1000)
}

  const drawScrollingText = (p5) => {
	p5.text(selectedWord, scrollXPos, height/2);
	scrollXPos-=5;
  }

  const draw = p5 => {
	p5.background(0, 0, 255);
    // update(p5);
	if(state == SketchState.HOME_PAGE) {
		drawText(p5);
		drawLines(p5);
		respondToMousePressedOnHomePage(p5)
	}

	if(state == SketchState.SCROLLING){
		drawScrollingText(p5);
	}



  };

  return (
    <SketchWrapper ref={wrapperRef}>
      <Sketch preload={preload} setup={setup} draw={draw} />
    </SketchWrapper>
  );
};

export default TextSketch;
