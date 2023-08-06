"use client";
import { ErrorComponent } from "@/app/_components";

const LoginErrorPage = (props: { error: Error; reset: () => void }) => {
    return <ErrorComponent {...props} title="Failed to login the user" />;
};

export default LoginErrorPage;
