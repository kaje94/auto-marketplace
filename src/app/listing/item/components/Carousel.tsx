import React from "react";
import { EmblaOptionsType } from "embla-carousel-react";
import EmblaCarousel from "./EmblaCarousel";

type PropType = {};

const Carousel: React.FC<PropType> = (props) => {
  const OPTIONS: EmblaOptionsType = {};
  const SLIDE_COUNT = 10;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  return <EmblaCarousel slides={SLIDES} options={OPTIONS} />;
};

export default Carousel;
