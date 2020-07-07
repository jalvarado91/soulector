/// <reference types="react-scripts" />

interface MarqueeProps {
  speed?: number;
  delay?: number;
  direction?: "right" | "left";
  childMargin?: number;
  children?: React.ReactNode | React.ReactNode[];
}

declare module "react-double-marquee" {
  export default class Marquee extends React.PureComponent<MarqueeProps, any> {}
}
