import * as React from "react";
import { GlobalStyle } from "../Global/global.styles";
import styled from 'styled-components'
import { Helmet } from "react-helmet";

export const Main = styled.section`

`

const Layout = props => {
    let description = "Seeing Through Networks";
    let url = "";
    let title =  "Seeing Through Networks";
  
    return (
      <>
        <Helmet
          htmlAttributes={{
            lang: "en"
          }}
          title={title}
          meta={[
            {
              rel: "canonical",
              href: `${url}`
            },
            {
              name: `description`,
              content: description
            },
            {
              property: `og:title`,
              content: title
            },
            {
              property: `og:description`,
              content: description
            },
          //   {
          //     property: `og:image`,
          //     content: SharingUrl
          //   },
            {
              property: `og:image:width`,
              content: `720`
            },
            {
              property: `og:image:height`,
              content: `720`
            },
            {
              property: `og:type`,
              content: `website`
            },
            {
              property: `og:url`,
              content: `${url}`
            },
            {
              name: `twitter:card`,
              content: `summary`
            },
            {
              name: `twitter:title`,
              content: title
            },
            {
              name: `twitter:description`,
              content: description
            }
          ]}
        />
        <GlobalStyle />
        <Main>{props.children}</Main>
      </>
    );
  };
  
  export default Layout;
  