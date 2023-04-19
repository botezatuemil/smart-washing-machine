import * as React from "react";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
const DoorInterior = () => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none">
    <Circle
      cx={110.5}
      cy={110.5}
      r={110.5}
      fill="url(#a)"
      
    />
    <Defs>
      <RadialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="rotate(90 0 110.5) scale(110.5)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop />
        <Stop offset={0.313} />
        <Stop offset={0.552} stopColor="#2E2E2E" />
        <Stop offset={0.583} stopColor="#303030" />
        <Stop offset={0.682} stopColor="#2B2B2B" />
        <Stop offset={0.906} stopColor="#0C0C0C" />
      </RadialGradient>
    </Defs>
  </Svg>
);
export default DoorInterior;
