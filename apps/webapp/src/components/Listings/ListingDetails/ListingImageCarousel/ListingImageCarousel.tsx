"use client";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import FsLightbox from "fslightbox-react";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { ListingImage } from "@/components/Common";
import { MaximizeIcon, StarIcon } from "@/icons";
import { VehicleTypes } from "@/utils/enum";
import { timeAgo, unCamelCase } from "@/utils/helpers";
import { Location, VehicleImageType } from "@/utils/types";
import { ListingImageCarouselThumbnails } from "./ListingImageCarouselThumbnails";

type PropType = {
    createdOn?: string;
    images?: VehicleImageType[];
    isFeatured?: boolean;
    loading?: boolean;
    location?: Location;
    options?: EmblaOptionsType;
    title?: string;
    vehicleType?: VehicleTypes;
};

export const ListingImageCarousel: React.FC<PropType> = (props) => {
    const { title = "", createdOn = "", images = [], options = {}, loading, vehicleType, location = {}, isFeatured } = props;
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
        [emblaMainApi, emblaThumbsApi],
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
                                        key={imageItem.id}
                                        className="relative shrink-0 grow-0 basis-full cursor-pointer pl-1 zoom-inner-image sm:pl-2 lg:pl-4"
                                        onClick={onOpenLightBox}
                                    >
                                        <button
                                            className="btn btn-circle btn-sm absolute right-1 top-1 z-10 opacity-75 hover:opacity-100 lg:right-3 lg:top-3"
                                            onClick={onOpenLightBox}
                                        >
                                            <MaximizeIcon height={18} width={18} />
                                        </button>
                                        <div className="block aspect-square w-full sm:aspect-video">
                                            <ListingImage
                                                className="aspect-square w-full bg-base-200 object-cover duration-300 ease-linear zoomable-cover-image sm:aspect-video"
                                                height={300}
                                                image={imageItem}
                                                location={location as Location}
                                                priority={selectedIndex === index ? true : undefined}
                                                title={title}
                                                width={450}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {isFeatured && (
                            <span className="alert badge badge-secondary absolute left-5 top-5">
                                <StarIcon /> Featured
                            </span>
                        )}
                        <div
                            className="absolute bottom-0 left-0 flex h-1/2 w-full cursor-pointer flex-col justify-end bg-gradient-to-t from-base-content to-transparent p-5 sm:h-2/6 "
                            onClick={onOpenLightBox}
                        >
                            <div className="text-3xl font-bold text-base-100 image-text-shadow lg:text-6xl">{title}</div>
                            <div className="-mb-1 mt-1 flex justify-between px-0.5 text-sm font-light text-base-200">
                                {vehicleType && <div>{unCamelCase(vehicleType)}</div>}
                                {createdOn && <div>Posted {timeAgo(new Date(createdOn))}</div>}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-1 sm:mt-2 lg:mt-4">
                    <div className="overflow-hidden" ref={emblaThumbsRef}>
                        <div className="-ml-1 flex flex-row sm:-ml-2 lg:-ml-4">
                            {loading
                                ? new Array(6).fill("").map((_, i) => <ListingImageCarouselThumbnails key={i} loading />)
                                : images.map((imageItem, index) => (
                                      <ListingImageCarouselThumbnails
                                          key={imageItem.id}
                                          image={imageItem}
                                          location={location as Location}
                                          selected={index === selectedIndex}
                                          title={title}
                                          onClick={() => onThumbClick(index)}
                                      />
                                  ))}
                        </div>
                    </div>
                </div>
            </div>
            {isLightBoxOpen && (
                <FsLightbox
                    sourceIndex={selectedIndex}
                    sources={images.map((item) => qs.stringifyUrl({ url: item.url!, query: { tr: "w-full" } }))}
                    toggler={isLightBoxOpen}
                    type="image"
                    disableSlideSwiping
                    exitFullscreenOnClose
                    openOnMount
                    onClose={() => setLightBoxOpen(false)}
                />
            )}
        </>
    );
};
