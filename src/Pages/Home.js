import * as React from "react";
import Layout from "../Components/Layout/Layout";
import styled from "styled-components";
import Environment from "../Components/Environment/Environment";


const HomeWrapper = styled.div`
`;

const Home = () => {
    return (
      <Layout>
        <HomeWrapper>
            <Environment />
        </HomeWrapper>
      </Layout>
    );
  };
  
  export default Home;
  