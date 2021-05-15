import * as React from "react";
import styled from "styled-components";
import TextSketch from "../Sketch/TextSketch";

const IntroductionModalWrapper = styled.div`
    width: 100%;
    height: 100%;
    background: grey;

`;

const FlexWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;

    height: 100%;
    width: 100%;
`
const IntroductionTextWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: ${props => props.left ? props.left : " 5%"};
    margin-top: ${props => props.left ? props.left : " 5%"};
    /* justify-content: center; */
    /* align-items: center; */
`
const IntroductionText = styled.h1`
    color: green;
    cursor: pointer;
`



const IntroductionModal = (props) => {
    const randomMarginLeft = () => {
        let min  = 5;
        let max = 30;
        let randomInt = Math.floor(Math.random() * (max - min + 1) + min);
        return `${randomInt}%`;
    }
    return (
      <IntroductionModalWrapper>
            {/* <FlexWrapper>
                <IntroductionTextWrapper left={randomMarginLeft()}>
                    <IntroductionText> Links</IntroductionText>
                </IntroductionTextWrapper>
                <IntroductionTextWrapper left={randomMarginLeft()}>
                    <IntroductionText> Nodes</IntroductionText>
                </IntroductionTextWrapper>
                <IntroductionTextWrapper left={randomMarginLeft()}>
                    <IntroductionText> Mesh</IntroductionText>
                </IntroductionTextWrapper>
                <IntroductionTextWrapper>
                    <IntroductionText> Power</IntroductionText>
                </IntroductionTextWrapper>
                <IntroductionTextWrapper>
                    <IntroductionText> Freedom</IntroductionText>
                </IntroductionTextWrapper>
                <IntroductionTextWrapper>
                    <IntroductionText> Communication</IntroductionText>
                </IntroductionTextWrapper>

            </FlexWrapper> */}
            <TextSketch />
      </IntroductionModalWrapper>
    );
  };
  
  export default IntroductionModal;