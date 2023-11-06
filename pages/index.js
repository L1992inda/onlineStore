import React from "react";
import OnlineStore from "./onlineStore";
export { getStaticProps } from "./data";

export default function Index(props) {
  return (
    <div>
      <OnlineStore data={props.data} />
    </div>
  );
}
