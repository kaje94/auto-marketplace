import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { displayFont } from "@/app/fonts";
import { getScopedI18n } from "@/locales/server";

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
    const [previousTwitter, previousOpenGraph, tAboutUs] = await Promise.all([
        (await parent).twitter || {},
        (await parent).openGraph || {},
        getScopedI18n("metadata.aboutUsRoute"),
    ]);

    const title = tAboutUs("title");
    const description = tAboutUs("desc");

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description },
        twitter: { ...previousTwitter, title, description },
    };
}

export default async function Page() {
    const [tAboutUs, tNav] = await Promise.all([getScopedI18n("appRouter.aboutUsRoute"), getScopedI18n("nav")]);

    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>{tNav("links.company.aboutUs")}</h3>
            <div className="mx-auto flex flex-col gap-1">
                <p>{tAboutUs("intro")}</p>
                <h3 className="mt-4 text-xl font-bold">{tAboutUs("ourMission.title")}</h3>
                <p>{tAboutUs("ourMission.desc")}</p>
                <h3 className="mt-4 text-xl font-bold">{tAboutUs("whatSetsUsApart.title")}</h3>
                <h2 className="mt-2 text-lg font-semibold">{tAboutUs("whatSetsUsApart.section1.title")}</h2>
                <p>{tAboutUs("whatSetsUsApart.section1.content")}</p>
                <h2 className="mt-2 text-lg font-semibold">{tAboutUs("whatSetsUsApart.section2.title")}</h2>
                <p>{tAboutUs("whatSetsUsApart.section2.content")}</p>
                <h2 className="mt-2 text-lg font-semibold">{tAboutUs("whatSetsUsApart.section3.title")}:</h2>
                <p>{tAboutUs("whatSetsUsApart.section3.content")}</p>
                <h2 className="mt-2 text-lg font-semibold">{tAboutUs("whatSetsUsApart.section4.title")}</h2>
                <p>{tAboutUs("whatSetsUsApart.section4.content")}</p>
                <h3 className="mt-4 text-xl font-bold">{tAboutUs("ourTeam.title")}</h3>
                <p>{tAboutUs("ourTeam.content")}</p>
                <h3 className="mt-4 text-xl font-bold">{tAboutUs("joinUs.title")}</h3>
                <p>{tAboutUs("joinUs.content")}</p>
                <p className="mt-4"> {tAboutUs("thankYou")}</p>
            </div>
        </div>
    );
}
