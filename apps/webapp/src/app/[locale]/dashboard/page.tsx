import { redirect } from "next/navigation";
import { LocalePathParam } from "@/utils/types";

export default function Page({ params }: LocalePathParam) {
    return redirect(`/${params.locale}/dashboard/profile`);
}
