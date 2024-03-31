import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = 'force-dynamic';

export default async function Playground () {
    noStore()
    const session = await getServerSession(authOptions);
    console.log({expires : session?.expires});
    // const [serverData, setServerData] = useState<string>();
    // const [error, setError] = useState<string>("");
    if (session){
        return <h2>Your session expires in {session.expires}.</h2>
    }
    return <h2>You're not logged in, homie 💀</h2>
}