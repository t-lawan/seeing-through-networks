import * as React from "react";
import styled from "styled-components";
import TextSketch from "../Sketch/TextSketch";
import VideoSketch from "../Sketch/VideoSketch";

const VideoModalWrapper = styled.div`
    width: 100%;
    height: 100%;
`;

const FlexWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: 100%;
`
const TextWrapper = styled.div`
    display: flex;
    flex-direction: row;
    /* justify-content: center; */
    /* align-items: center; */
`
const Text = styled.h1`
    color: rgb(0,255,0);
    cursor: pointer;
`



const VideoModal = (props) => {

    return (
      <VideoModalWrapper>
        <VideoSketch video={props.video} />

      </VideoModalWrapper>
    );
  };
  
  export default VideoModal;