import { useAuth } from "../../hooks/useAuth"
import { useRouter } from "next/router"
import { Event } from "../../components/event"


export default function EventsPage() {
    const {user} = useAuth()
    const router = useRouter()


    if(!user) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <Event />
        </div>
    )
}