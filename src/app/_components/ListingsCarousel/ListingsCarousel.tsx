"use client";
import React, { useCallback } from "react";
import useEmblaCarousel, { EmblaCarouselType } from "embla-carousel-react";
import { PrevButton, NextButton, usePrevNextButtons } from "./ListingsCarouselButtons";
import Autoplay from "embla-carousel-autoplay";
import { ListingItem } from "../ListingItem";
import { ListingItem as ListingItemType } from "@/utils/types";
import clsx from "clsx";

type Props = {
    title?: string;
    items?: ListingItemType[];
    loading?: boolean;
    loadingItemCount?: number;
    bgFromColor?: "from-white" | "from-base-200";
};

export const ListingsCarousel = (props: Props) => {
    const { items, loading, loadingItemCount = 5, title, bgFromColor = "from-white" } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true, axis: "x", containScroll: "trimSnaps" }, [Autoplay()]);

    const onButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
        const { autoplay } = emblaApi.plugins();
        if (!autoplay) return;
        if (autoplay.options.stopOnInteraction !== false) autoplay.stop();
    }, []);

    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi, onButtonClick);

    return (
        <>
            {title && <div className="divider mt-16">{title}</div>}
            <div className="relative flex items-center">
                <div className="rounded-box relative  flex-1 overflow-hidden px-2 py-5" ref={emblaRef}>
                    <div className="flex h-auto touch-pan-y flex-row">
                        {loading ? (
                            <>
                                {new Array(loadingItemCount).fill("").map((_, i) => (
                                    <div
                                        key={`item-${i}`}
                                        className="relative mr-4 w-[calc(75%)] min-w-0  flex-none sm:w-[calc(60%)] md:w-[calc(39%)] lg:w-[calc(27%)] 2xl:w-[calc(21%)]"
                                    >
                                        <ListingItem loading />
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                {items?.map((item) => (
                                    <div
                                        key={item.id}
                                        className="relative mr-4 w-[calc(75%)] min-w-0  flex-none sm:w-[calc(60%)] md:w-[calc(39%)] lg:w-[calc(27%)] 2xl:w-[calc(21%)]"
                                    >
                                        <ListingItem item={item} />
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {!loading && (
                    <>
                        {!prevBtnDisabled && (
                            <span className="absolute left-4 top-8 z-10">
                                <PrevButton onClick={onPrevButtonClick} />
                            </span>
                        )}
                        {!nextBtnDisabled && (
                            <span className="absolute right-4 top-8 z-10">
                                <NextButton onClick={onNextButtonClick} />
                            </span>
                        )}
                    </>
                )}

                <div className={clsx("absolute right-0 h-full w-8 bg-gradient-to-l from-white to-transparent", bgFromColor)}></div>
            </div>
        </>
    );
};
