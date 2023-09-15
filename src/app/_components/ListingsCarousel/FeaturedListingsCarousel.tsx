import { ReactNode, Suspense } from "react";
import { api } from "@/utils/api";
import { righteousFont } from "@/app/fonts";
import clsx from "clsx";
import { ListingsCarousel } from "./ListingsCarousel";

export const FeaturedListingsCarousel = () => {
    return (
        <Suspense fallback={<FeaturedListingsCarouselLoading />}>
            <FeaturedListingsCarouselWithData />
        </Suspense>
    );
};

const FeaturedSectionWrap = ({ children }: { children: ReactNode }) => {
    return (
        <section className="relative bg-base-200 py-12 md:py-20">
            <div className="container mx-auto mb-2 w-full md:mb-6">
                <h3 className={clsx(righteousFont.className, "mb-10 text-center text-2xl lg:text-4xl")}>Featured Adverts</h3>
                {children}
            </div>
        </section>
    );
};

const FeaturedListingsCarouselWithData = async () => {
    const featuredListings = await api.getFeaturedListings();

    if (featuredListings.length > 0) {
        return (
            <FeaturedSectionWrap>
                <ListingsCarousel items={featuredListings} bgFromColor="from-base-200" />
            </FeaturedSectionWrap>
        );
    }

    return null;
};

const FeaturedListingsCarouselLoading = async () => {
    return (
        <FeaturedSectionWrap>
            <ListingsCarousel loading bgFromColor="from-base-200" />
        </FeaturedSectionWrap>
    );
};
