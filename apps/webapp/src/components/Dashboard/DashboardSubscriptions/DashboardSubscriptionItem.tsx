import { clsx } from "clsx";
import dynamic from "next/dynamic";
import { FC } from "react";
import { SubscriptionItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { ContextMenuLoading } from "@/components/Common/ContextMenu";
import { COUNTRIES } from "@/utils/countries";
import { getDistanceUnit, getFormattedCurrency, getFormattedDistance, getRandomItem, getRandomNumber, timeAgo, unCamelCase } from "@/utils/helpers";

/** Lazily loaded context menu */
const DashboardSubscriptionItemMenu = dynamic(() => import("./DashboardSubscriptionItemMenu").then((mod) => mod.DashboardSubscriptionItemMenu), {
    loading: () => <ContextMenuLoading />,
    ssr: false,
});

interface Props {
    /** Base path to be used when forwarding to a subpath */
    basePath?: string;
    /** Whether or not to show the placeholder data */
    loading?: boolean;
    /** Details of a particular subscription item */
    subscriptionItem?: SubscriptionItem;
}

/** To represent an individual subscription item within the subscription list */
export const DashboardSubscriptionItem: FC<Props> = (props) => {
    const { subscriptionItem: listingSubscriptionItem = {}, loading, basePath } = props;
    const { id, data, user, active, createdAt } = listingSubscriptionItem as SubscriptionItem;

    const distanceUnit = getDistanceUnit(user?.data?.countryCode);
    const countryItem = COUNTRIES[user?.data?.countryCode || ""];

    const subscriptionDetails: { label: string; value: string | number }[] = [];

    if (data?.type) {
        subscriptionDetails.push({ label: "Type", value: unCamelCase(data?.type) });
    }

    if (data?.condition) {
        subscriptionDetails.push({ label: "Condition", value: unCamelCase(data?.condition) });
    }

    if (data?.brand) {
        subscriptionDetails.push({ label: "Brand", value: data?.brand });
    }

    if (data?.model) {
        subscriptionDetails.push({ label: "Model", value: data?.model });
    }

    if (data?.trim) {
        subscriptionDetails.push({ label: "Trim", value: data?.trim });
    }

    if (data?.minPrice && data?.maxPrice) {
        subscriptionDetails.push({
            label: "Price Range",
            value: `${getFormattedCurrency(data?.minPrice, countryItem?.[2]!)}-${getFormattedCurrency(data?.maxPrice, countryItem?.[2]!)}`,
        });
    } else if (data?.minPrice) {
        subscriptionDetails.push({ label: "Minimum Price", value: getFormattedCurrency(data?.minPrice, countryItem?.[2]!) });
    } else if (data?.maxPrice) {
        subscriptionDetails.push({ label: "Maximum Price", value: getFormattedCurrency(data?.maxPrice, countryItem?.[2]!) });
    }

    if (data?.minMillage && data?.maxMillage) {
        subscriptionDetails.push({
            label: "Mileage Range",
            value: `${getFormattedDistance(data?.minMillage, distanceUnit)}-${getFormattedDistance(data?.maxMillage, distanceUnit)}`,
        });
    } else if (data?.minMillage) {
        subscriptionDetails.push({ label: "Minimum Mileage", value: getFormattedDistance(data?.minMillage, distanceUnit) });
    } else if (data?.maxMillage) {
        subscriptionDetails.push({ label: "Maximum Mileage", value: getFormattedDistance(data?.maxMillage, distanceUnit) });
    }

    if (data?.minYearOfManufacture && data?.maxYearOfManufacture) {
        subscriptionDetails.push({
            label: "Manufactured between",
            value: `${data?.minYearOfManufacture}-${data?.maxYearOfManufacture}`,
        });
    } else if (data?.minYearOfManufacture) {
        subscriptionDetails.push({ label: "Manufactured after", value: data?.minYearOfManufacture });
    } else if (data?.maxYearOfManufacture) {
        subscriptionDetails.push({ label: "Manufactured before", value: data?.maxYearOfManufacture });
    }

    if (data?.minYearOfRegistration && data?.maxYearOfRegistration) {
        subscriptionDetails.push({
            label: "Registered between",
            value: `${data?.minYearOfRegistration}-${data?.maxYearOfRegistration}`,
        });
    } else if (data?.minYearOfRegistration) {
        subscriptionDetails.push({ label: "Registered after", value: data?.minYearOfRegistration });
    } else if (data?.maxYearOfRegistration) {
        subscriptionDetails.push({ label: "Registered before", value: data?.maxYearOfRegistration });
    }

    const placeholderWidth = ["w-32", "w-40", "w-44", "w-28", "w-36"];

    const myAddItemContent = (
        <div className="flex flex-col gap-0.5 p-3 md:p-4 " data-testid="dashboard-subscription-item">
            {loading ? (
                <div className={clsx("h-6 bg-base-200", getRandomItem(["w-48", "w-44", "w-52", "w-60"]))} />
            ) : (
                <div className="flex gap-2">
                    <div className="flex flex-1 flex-wrap items-center gap-0.5 md:gap-2 xl:gap-4">
                        <span className="text-xl font-semibold text-base-content">{data?.displayName}</span>
                        <span
                            className={clsx({
                                "badge badge-lg": true,
                                "badge-ghost": !active,
                                "badge-success": active,
                            })}
                        >
                            {active ? "Active" : "Inactive"}
                        </span>
                    </div>
                    <DashboardSubscriptionItemMenu key={id} basePath={basePath} subscriptionItem={listingSubscriptionItem as SubscriptionItem} />
                </div>
            )}

            {loading ? (
                <div className={clsx("h-5 bg-base-200", getRandomItem(["w-60", "w-64", "w-72"]))} />
            ) : (
                <div className="text-sm ">
                    <span className="text-neutral opacity-50">Notification Frequency:</span>&nbsp;
                    <span className="font-light">{unCamelCase(data?.notificationFrequency)}</span>
                </div>
            )}

            {loading ? (
                <div className={clsx("h-5 bg-base-200", getRandomItem(["w-52", "w-40", "w-48"]))} />
            ) : (
                <div className="text-sm ">
                    <span className="text-neutral opacity-50">Expires on:</span>&nbsp;
                    <span className="font-light">{active ? new Date(data?.subscriptionExpiryDate!).toDateString() : "N/A"}</span>
                </div>
            )}

            <div className="mt-1 flex flex-col gap-1">
                {loading ? <div className="h-5 w-14 bg-base-200" /> : <div className="text-sm text-neutral opacity-50">Criteria:</div>}
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
                    <div className="text-xs text-neutral-400">Created {timeAgo(new Date(createdAt))}</div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return <div className="card mb-3 h-fit overflow-x-hidden bg-base-100 shadow">{myAddItemContent}</div>;
    }

    return <div className="card mb-3 h-fit bg-base-100 shadow">{myAddItemContent}</div>;
};
