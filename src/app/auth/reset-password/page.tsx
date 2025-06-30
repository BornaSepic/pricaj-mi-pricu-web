import ResetPasswordPage from "../../../components/reset-password";
import {Suspense} from "react";

const Page = async () => {
    return (
        <Suspense>
            <ResetPasswordPage />
        </Suspense>
    )
}

export default Page