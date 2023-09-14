"use client";
import React, { useCallback } from "react";
import useEmblaCarousel, { EmblaCarouselType } from "embla-carousel-react";
import { PrevButton, NextButton, usePrevNextButtons } from "./ListingsCarouselButtons";
import Autoplay from "embla-carousel-autoplay";
import { ListingItem } from "../ListingItem";
import { ListingItem as ListingItemType } from "@/utils/types";
import { getFormattedCurrency, getListingTags } from "@/utils/helpers";

type Props = {
    items?: ListingItemType[];
};

export const ListingsCarousel = (props: Props) => {
    const { items } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true, axis: "x", containScroll: "trimSnaps" }, [Autoplay()]);

    const onButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
        const { autoplay } = emblaApi.plugins();
        if (!autoplay) return;
        if (autoplay.options.stopOnInteraction !== false) autoplay.stop();
    }, []);

    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi, onButtonClick);

    return (
        <div className="relative flex items-center">
            <div className="rounded-box relative  flex-1 overflow-hidden px-2 py-5" ref={emblaRef}>
                <div className="flex h-auto touch-pan-y flex-row">
                    {items?.map((item) => (
                        <div
                            key={item.id}
                            className="relative mr-4 w-[calc(65%)] min-w-0  flex-none sm:w-[calc(60%)] md:w-[calc(39%)] lg:w-[calc(27%)] 2xl:w-[calc(21%)]"
                        >
                            <ListingItem
                                id={item.id}
                                title={item.title}
                                price={getFormattedCurrency(item.price.amount, item.price.currency)}
                                description={item.description}
                                tags={getListingTags(item.location, item.vehicle)}
                                imageUrl={item.vehicle?.vehicleImages[0]?.url ?? ""}
                                blurDataURL={item.vehicle?.vehicleImages[0]?.blurDataURL}
                                imageAlt={`${item.title} thumbnail`}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <span className="absolute left-4 z-10">
                <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            </span>
            <span className="absolute right-4 z-10">
                <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
            </span>
        </div>
    );
};
