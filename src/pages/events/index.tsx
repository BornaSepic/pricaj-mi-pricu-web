import { useAuth } from "../../hooks/useAuth"
import { Event } from "../../components/event"


export default function EventsPage() {
    const {user} = useAuth()

    if(!user) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <Event />
        </div>
    )
}