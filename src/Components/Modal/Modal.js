import * as React from "react";
import styled from "styled-components";
import { ModalTypes } from "../../Utility/Helper";
import IntroductionModal from "./IntroductionModal";
import { Colours } from "../Global/global.styles";
import VideoModal from "./VideoModal";
import UbuntuModal from "./UbuntuModal";


const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left:0;
    width: 100vw;
    height: 100vh;
    background: red;
    display: ${props => props.show ? 'block': 'none'};

`;

const FlexWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
`
const MediumNavigationWrapper = styled.div``

const MediumNavigation = styled.h1`
    position: absolute;
    bottom: 0;
    right: 0;
    padding-right: 2vw;
    color:rgb(0,255,0);
`


const Modal = (props) => {
    const displayItem = () => {
        let type = props.type;
        let comp;
        console.log('TYPE', type)
        switch(type){
            case ModalTypes.INTRODUCTION: {
                comp = (
                    <IntroductionModal />
                );
                break;
            };
            case ModalTypes.NEOLIBERAL_FILM: {
                comp =  (
                    <VideoModal />
                );
                break;
            }
            case ModalTypes.BURNING_MAN: {
                comp =  (
                    <UbuntuModal />
                )
                break;
            }
            default: 
                break;
        }

        return comp
    }

    // onClick={() => props.closeModal()}

    return (
      <ModalWrapper show={props.show} >
            <FlexWrapper>
            {props.show ? displayItem() : null}
            {/* {displayItem()} */}
            {props.show ? <MediumNavigation onClick={() => props.closeModal()}> medium </MediumNavigation> : null}
            </FlexWrapper>
      </ModalWrapper>
    );
  };
  
  export default Modal;
  