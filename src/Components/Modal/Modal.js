import * as React from "react";
import styled from "styled-components";
import { ModalTypes } from "../../Utility/Helper";
import IntroductionModal from "./IntroductionModal";


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


const Modal = (props) => {
    const displayItem = () => {
        let type = props.type;
        let comp;
        switch(type){
            case ModalTypes.INTRODUCTION: {
                comp = (
                    <IntroductionModal />
                )
                break;
            };
            case ModalTypes.NEOLIBERAL_FILM: {
                comp =  (
                    <IntroductionModal />
                )
                break;
            }
            case ModalTypes.BURNING_MAN: {
                comp =  (
                    <IntroductionModal />
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

            </FlexWrapper>
      </ModalWrapper>
    );
  };
  
  export default Modal;
  