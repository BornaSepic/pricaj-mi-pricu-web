import { useAuth } from "../../hooks/useAuth"
import { useRouter } from "next/router"
import {PastReadingsPage} from "../../components/my-past-reading";


export default function MyPastReadings() {
    const {user} = useAuth()
    const router = useRouter()


    if(!user) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <PastReadingsPage />
        </div>
    )
}