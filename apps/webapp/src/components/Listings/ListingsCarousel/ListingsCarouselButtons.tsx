import { EmblaCarouselType } from "embla-carousel-react";
import React, { ComponentProps, useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";

export const usePrevNextButtons = (emblaApi: EmblaCarouselType | undefined, onButtonClick: (emblaApi: EmblaCarouselType) => void) => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollPrev();
        if (onButtonClick) onButtonClick(emblaApi);
    }, [emblaApi, onButtonClick]);

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollNext();
        if (onButtonClick) onButtonClick(emblaApi);
    }, [emblaApi, onButtonClick]);

    const onSelect = useCallback((emblaApi: EmblaCarouselType | undefined) => {
        setPrevBtnDisabled(!emblaApi?.canScrollPrev());
        setNextBtnDisabled(!emblaApi?.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi);
        emblaApi.on("reInit", onSelect);
        emblaApi.on("select", onSelect);
    }, [emblaApi, onSelect]);

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    };
};

export const PrevButton = (props: ComponentProps<"button">) => {
    const { children, ...restProps } = props;

    return (
        <button className="btn btn-circle opacity-80 shadow-md" type="button" {...restProps}>
            <ChevronLeftIcon className="mr-1" />
            {children}
        </button>
    );
};

export const NextButton = (props: ComponentProps<"button">) => {
    const { children, ...restProps } = props;

    return (
        <button className="btn btn-circle opacity-80 shadow-md" type="button" {...restProps}>
            <ChevronRightIcon className="ml-1" />
            {children}
        </button>
    );
};
