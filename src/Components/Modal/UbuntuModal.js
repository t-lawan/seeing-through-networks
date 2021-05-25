import * as React from "react";
import styled from "styled-components";
import TextSketch from "../Sketch/TextSketch";
import UbuntuSketch from "../Sketch/UbuntuSketch";

const UbuntuModalWrapper = styled.div`
    width: 100%;
    height: 100%;

`;




const UbuntuModal = (props) => {

    return (
      <UbuntuModalWrapper>
        <UbuntuSketch />

      </UbuntuModalWrapper>
    );
  };
  
  export default UbuntuModal;