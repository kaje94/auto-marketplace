"use client";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import { Thumb } from "./CarouselThumbsButton";
import Autoplay from "embla-carousel-autoplay";
import FsLightbox from "fslightbox-react";
import { MaximizeIcon } from "@/icons";
import { ImageFile } from "@/utils/types";
import Image from "next/image";

type PropType = {
    title?: string;
    images?: ImageFile[];
    options?: EmblaOptionsType;
    loading?: boolean;
};

export const Carousel: React.FC<PropType> = (props) => {
    const { title = "", images = [], options = {}, loading } = props;
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
            <div className="p-3 lg:p-5 xl:p-6">
                {loading ? (
                    <div className="rounded-box aspect-square w-full animate-pulse bg-base-200 sm:aspect-video" />
                ) : (
                    <div className="rounded-box relative overflow-hidden bg-base-200" ref={emblaMainRef}>
                        <div className="relative -ml-1 flex h-auto touch-pan-y flex-row sm:-ml-2 lg:-ml-4">
                            {images.map((imageItem, index) => {
                                return (
                                    <div
                                        className="relative shrink-0 grow-0 basis-full cursor-pointer pl-1 zoom-inner-image sm:pl-2 lg:pl-4"
                                        key={imageItem.id}
                                        onClick={onOpenLightBox}
                                    >
                                        <button
                                            className="btn-sm btn-circle btn absolute right-1 top-1 z-10 opacity-75 hover:opacity-100 lg:right-3 lg:top-3"
                                            onClick={onOpenLightBox}
                                        >
                                            <MaximizeIcon height={18} width={18} />
                                        </button>
                                        <div className="block aspect-square w-full sm:aspect-video">
                                            <Image
                                                height={300}
                                                width={450}
                                                alt={`${title} ${index}`}
                                                src={imageItem.url ?? ""}
                                                priority={selectedIndex === index}
                                                className="aspect-square w-full bg-base-200 object-cover duration-300 ease-linear zoomable-cover-image sm:aspect-video"
                                                placeholder={imageItem.blurDataURL ? "blur" : "empty"}
                                                blurDataURL={imageItem.blurDataURL}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div
                            onClick={onOpenLightBox}
                            className="absolute bottom-0 left-0 flex h-1/2 w-full cursor-pointer flex-col justify-end bg-gradient-to-t from-base-content to-transparent p-5 sm:h-2/6 "
                        >
                            <div className="text-3xl font-bold text-base-100 lg:text-6xl" style={{ textShadow: `0 0 20px black` }}>
                                {title}
                            </div>
                            <div className="mt-2 text-sm font-light text-base-200">Posted 500 days ago</div>
                        </div>
                    </div>
                )}

                <div className="mt-1 sm:mt-2 lg:mt-4">
                    <div className="overflow-hidden" ref={emblaThumbsRef}>
                        <div className="-ml-1 flex flex-row sm:-ml-2 lg:-ml-4">
                            {loading
                                ? new Array(6).fill("").map((_, i) => <Thumb loading key={i} />)
                                : images.map((imageItem, index) => (
                                      <Thumb
                                          onClick={() => onThumbClick(index)}
                                          selected={index === selectedIndex}
                                          imgSrc={imageItem.url ?? ""}
                                          key={imageItem.id}
                                          imageAlt={`${title} thumbnail ${index}`}
                                          blurDataURL={imageItem.blurDataURL}
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
                    sources={images.map((item) => item.url ?? "")}
                    onClose={() => setLightBoxOpen(false)}
                    type="image"
                    openOnMount
                    disableSlideSwiping
                />
            )}
        </>
    );
};
