
import { useParams } from "react-router"

function UserPage() {
    const { steamUrl } = useParams();
    return (
        <div>{steamUrl}</div>
    )
}

export default UserPage