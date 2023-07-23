"use client";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import { Thumb } from "./EmblaCarouselThumbsButton";
import imageByIndex from "./imageByIndex";
import Autoplay from "embla-carousel-autoplay";
import FsLightbox from "fslightbox-react";
import { MaximizeIcon } from "@/icons";

type PropType = {
    slides: number[];
    options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
    const { slides, options } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLightBoxOpen, setLightBoxOpen] = useState(false);
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options, [Autoplay({ delay: 5000 })]);
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: "keepSnaps",
        dragFree: true,
    });

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) return;
            emblaMainApi.scrollTo(index);
            emblaMainApi?.plugins()?.autoplay?.stop();
        },
        [emblaMainApi, emblaThumbsApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        setSelectedIndex(emblaMainApi.selectedScrollSnap());
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
    }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

    const onOpenLightBox = () => {
        emblaMainApi?.plugins()?.autoplay?.stop();
        setLightBoxOpen(true);
    };

    useEffect(() => {
        if (!emblaMainApi) return;
        onSelect();
        emblaMainApi.on("select", onSelect);
        emblaMainApi.on("reInit", onSelect);
    }, [emblaMainApi, onSelect]);

    return (
        <>
            <div className="embla p-3 lg:p-5 xl:p-6">
                <div className="rounded-box overflow-hidden" ref={emblaMainRef}>
                    <div className="-ml-1 flex h-auto touch-pan-y flex-row sm:-ml-2 lg:-ml-4">
                        {slides.map((index) => (
                            <div
                                className="relative shrink-0 grow-0 basis-full cursor-pointer overflow-hidden pl-1 zoom-inner-image sm:pl-2 lg:pl-4"
                                key={index}
                                onClick={onOpenLightBox}
                            >
                                <button
                                    className="btn-sm btn-circle btn absolute right-1 top-1 z-10 opacity-75 hover:opacity-100 lg:right-3 lg:top-3"
                                    onClick={onOpenLightBox}
                                >
                                    <MaximizeIcon height={18} width={18} />
                                </button>
                                <div className="rounded-box block aspect-square w-full overflow-hidden sm:aspect-video ">
                                    <img
                                        className="aspect-square w-full object-cover duration-300 ease-linear zoomable-cover-image sm:aspect-video"
                                        src={imageByIndex(index)}
                                        alt="todo: Your alt text"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-1 sm:mt-2 lg:mt-4">
                    <div className="overflow-hidden" ref={emblaThumbsRef}>
                        <div className="-ml-1 flex flex-row sm:-ml-2 lg:-ml-4">
                            {slides.map((index) => (
                                <Thumb
                                    onClick={() => onThumbClick(index)}
                                    selected={index === selectedIndex}
                                    index={index}
                                    imgSrc={imageByIndex(index)}
                                    key={index}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {isLightBoxOpen && (
                <FsLightbox
                    toggler={isLightBoxOpen}
                    sourceIndex={selectedIndex}
                    exitFullscreenOnClose
                    sources={slides.map((index) => imageByIndex(index))}
                    onClose={() => setLightBoxOpen(false)}
                    type="image"
                    openOnMount
                    disableSlideSwiping
                />
            )}
        </>
    );
};

export default EmblaCarousel;
