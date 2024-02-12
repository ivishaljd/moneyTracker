import React, { useContext } from "react";
import "semantic-ui-css/semantic.min.css";
import { Dimmer, Loader } from "semantic-ui-react";
import { MyContext } from "../context/Context";

function Loading() {
  const { loading } = useContext(MyContext);
  return (
    <Dimmer active={loading} page={true}>
      <Loader />
    </Dimmer>
  );
}

export default Loading;
