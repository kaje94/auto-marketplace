"use client";
import { clsx } from "clsx";
import dynamic from "next/dynamic";
import { FC } from "react";
import { ContextMenuLoading } from "@/components/Common/ContextMenu";
import { useScopedI18n } from "@/locales/client";
import {
    getFormattedCurrency,
    getFormattedDistance,
    getRandomItem,
    getRandomNumber,
    getYearFromDateString,
    timeAgo,
    unCamelCase,
} from "@/utils/helpers";
import { ListingSubscriptionItem } from "@/utils/types";

const DashboardSubscriptionItemMenu = dynamic(() => import("./DashboardSubscriptionItemMenu").then((mod) => mod.DashboardSubscriptionItemMenu), {
    loading: () => <ContextMenuLoading />,
    ssr: false,
});

interface Props {
    basePath?: string;
    listingSubscriptionItem?: ListingSubscriptionItem;
    loading?: boolean;
}

export const DashboardSubscriptionItem: FC<Props> = (props) => {
    const { listingSubscriptionItem = {}, loading, basePath } = props;
    const {
        id,
        displayName,
        active,
        notificationFrequency,
        createdOn,
        subscriptionExpiryDate,
        brand,
        condition,
        type,
        model,
        trim,
        minPrice,
        maxPrice,
        minMillage,
        maxMillage,
        minYearOfManufacture,
        maxYearOfManufacture,
        minYearOfRegistration,
        maxYearOfRegistration,
    } = listingSubscriptionItem as ListingSubscriptionItem;

    const subscriptionDetails: { label: string; value: string | number }[] = [];

    const tCommon = useScopedI18n("common");
    const tForm = useScopedI18n("form");
    const tSubscriptionForm = useScopedI18n("components.forms.subscriptions.form");
    const tDashboardSubscriptions = useScopedI18n("components.dashboardSubscriptions");

    if (type) {
        subscriptionDetails.push({ label: tForm("vehicleType.label"), value: unCamelCase(type) });
    }

    if (condition) {
        subscriptionDetails.push({ label: tForm("condition.label"), value: unCamelCase(condition) });
    }

    if (brand) {
        subscriptionDetails.push({ label: tForm("brand.label"), value: brand });
    }

    if (model) {
        subscriptionDetails.push({ label: tForm("model.label"), value: model });
    }

    if (trim) {
        subscriptionDetails.push({ label: tForm("trim.label"), value: trim });
    }

    if (minPrice && maxPrice) {
        subscriptionDetails.push({
            label: tSubscriptionForm("priceRangeText"),
            value: `${getFormattedCurrency(minPrice.amount, minPrice.currencySymbol)}-${getFormattedCurrency(
                maxPrice.amount,
                maxPrice.currencySymbol,
            )}`,
        });
    } else if (minPrice) {
        subscriptionDetails.push({ label: tForm("minPrice.label"), value: getFormattedCurrency(minPrice.amount, minPrice.currencySymbol) });
    } else if (maxPrice) {
        subscriptionDetails.push({ label: tForm("maxPrice.label"), value: getFormattedCurrency(maxPrice.amount, maxPrice.currencySymbol) });
    }

    if (minMillage?.distance && maxMillage?.distance) {
        subscriptionDetails.push({
            label: tSubscriptionForm("mileageRangeText"),
            value: `${getFormattedDistance(minMillage.distance, minMillage.unit)}-${getFormattedDistance(maxMillage.distance, maxMillage.unit)}`,
        });
    } else if (minMillage?.distance) {
        subscriptionDetails.push({ label: tForm("mileageMin.label"), value: getFormattedDistance(minMillage.distance, minMillage.unit) });
    } else if (maxMillage?.distance) {
        subscriptionDetails.push({ label: tForm("mileageMax.label"), value: getFormattedDistance(maxMillage.distance, maxMillage.unit) });
    }

    if (minYearOfManufacture && maxYearOfManufacture) {
        subscriptionDetails.push({
            label: tDashboardSubscriptions("manufacturedBetween"),
            value: `${getYearFromDateString(minYearOfManufacture)}-${getYearFromDateString(maxYearOfManufacture)}`,
        });
    } else if (minYearOfManufacture) {
        subscriptionDetails.push({ label: tForm("yomStartDate.label"), value: getYearFromDateString(minYearOfManufacture) });
    } else if (maxYearOfManufacture) {
        subscriptionDetails.push({ label: tForm("yomEndDate.label"), value: getYearFromDateString(maxYearOfManufacture) });
    }

    if (minYearOfRegistration && maxYearOfRegistration) {
        subscriptionDetails.push({
            label: tDashboardSubscriptions("registeredBetween"),
            value: `${getYearFromDateString(minYearOfRegistration)}-${getYearFromDateString(maxYearOfRegistration)}`,
        });
    } else if (minYearOfRegistration) {
        subscriptionDetails.push({ label: tForm("yearOfRegistrationStart.label"), value: getYearFromDateString(minYearOfRegistration) });
    } else if (maxYearOfRegistration) {
        subscriptionDetails.push({ label: tForm("yearOfRegistrationEnd.label"), value: getYearFromDateString(maxYearOfRegistration) });
    }

    const placeholderWidth = ["w-32", "w-40", "w-44", "w-28", "w-36"];

    const myAddItemContent = (
        <div className="flex flex-col gap-0.5 p-3 md:p-4 ">
            {loading ? (
                <div className={clsx("h-6 bg-base-200", getRandomItem(["w-48", "w-44", "w-52", "w-60"]))} />
            ) : (
                <div className="flex gap-2">
                    <div className="flex flex-1 flex-wrap items-center gap-0.5 md:gap-2 xl:gap-4">
                        <span className="text-xl font-semibold text-base-content">{displayName}</span>
                        <span
                            className={clsx({
                                "badge badge-lg": true,
                                "badge-ghost": !active,
                                "badge-success": active,
                            })}
                        >
                            {active ? tCommon("active") : tCommon("inactive")}
                        </span>
                    </div>
                    <DashboardSubscriptionItemMenu
                        key={id}
                        basePath={basePath}
                        listingSubscriptionItem={listingSubscriptionItem as ListingSubscriptionItem}
                    />
                </div>
            )}

            {loading ? (
                <div className={clsx("h-5 bg-base-200", getRandomItem(["w-60", "w-64", "w-72"]))} />
            ) : (
                <div className="text-sm ">
                    <span className="text-neutral opacity-50">{tForm("subscriptionFrequency.label")}</span>&nbsp;
                    <span className="font-light">{unCamelCase(notificationFrequency)}</span>
                </div>
            )}

            {loading ? (
                <div className={clsx("h-5 bg-base-200", getRandomItem(["w-52", "w-40", "w-48"]))} />
            ) : (
                <div className="text-sm ">
                    <span className="text-neutral opacity-50">{tDashboardSubscriptions("expiresOn")}</span>&nbsp;
                    <span className="font-light">{active ? new Date(subscriptionExpiryDate).toDateString() : tCommon("notApplicable")}</span>
                </div>
            )}

            <div className="mt-1 flex flex-col gap-1">
                {loading ? (
                    <div className="h-5 w-14 bg-base-200" />
                ) : (
                    <div className="text-sm text-neutral opacity-50">{tDashboardSubscriptions("criteria")}</div>
                )}
                <div className="flex flex-wrap items-center gap-1">
                    {loading ? (
                        <>
                            {new Array(getRandomNumber(1, 7)).fill("").map((_, i) => (
                                <span key={i} className={clsx("badge h-6 bg-base-200", getRandomItem(placeholderWidth))} />
                            ))}
                        </>
                    ) : (
                        <>
                            {subscriptionDetails.map((item) => (
                                <span key={item.label} className="badge badge-ghost badge-lg">
                                    <span className="font-light opacity-80">{item.label}:&nbsp;</span>
                                    <span className="font-medium">{item.value}</span>
                                </span>
                            ))}
                        </>
                    )}
                </div>
            </div>

            <div className="mt-2">
                {loading ? (
                    <div className="h-4 w-32 bg-base-200" />
                ) : (
                    <div className="text-xs text-neutral-400">{tCommon("created", { ago: timeAgo(new Date(createdOn)) })}</div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return <div className="card mb-3 h-fit overflow-x-hidden bg-base-100 shadow">{myAddItemContent}</div>;
    }

    return <div className="card mb-3 h-fit bg-base-100 shadow">{myAddItemContent}</div>;
};
