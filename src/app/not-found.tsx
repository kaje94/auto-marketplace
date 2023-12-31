"use client";
import { Metadata } from "next";
import { ErrorComponent } from "@/components/Common";

const title = "Targabay - 404 | Page Not Found";
const description =
    "Oops! It seems like the page you're looking for on Targabay isn't here. Navigate back to our homepage or explore our site to discover a world of cars, bikes, and more. Targabay – Your trusted online marketplace for a seamless automotive journey awaits.";

export const metadata: Metadata = { title, description, alternates: {}, robots: { index: false, follow: false } };

export default function NotFoundPage() {
    return <ErrorComponent title="Page not found!" />;
}
