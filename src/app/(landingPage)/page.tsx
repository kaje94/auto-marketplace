import { ListingsCarousel } from "@/components/ListingsCarousel";
import { api } from "@/utils/api";

export default async function Page() {
    const featuredListings = await api.getFeaturedListings();

    return <ListingsCarousel bgFromColor="from-hero" items={featuredListings} showEmpty={false} tinted />;
}
