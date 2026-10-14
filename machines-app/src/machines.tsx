
import {useEffect, useState} from 'react';


const MachineComponent = () => {
    type Machine = {
     id: string;
    status: "online" | "offline";
    };

    const [showOnlyOnline, setShowOnlyOnline] = useState(true)
    const [machineSearch, setMachineSearch] = useState("")
    const [machines, setMachines] = useState<Machine[]>([]);
    const displayedMachines = (showOnlyOnline 
    ? machines.filter(machine => machine.status === "online")
    : machines).filter(machine=> machine.id.toLowerCase().includes(machineSearch.toLowerCase()));
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null> (null);

    const updateMachine = async (id: string, newStatus: "online" | "offline") =>
    {
        try {
            const response = await fetch (`http://127.0.0.1:8000/machines/${id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    status: newStatus,
                }),
            }
            
        )
            if (!response.ok){
                    throw new Error("Failed to fetch machines");
            }
            fetchMachines() 
        }
        catch (err){
            setError(err instanceof Error ? err.message : "snth wrong")
        }
    }
    const fetchMachines = async () => {
            try {
                const response = await fetch (`http://127.0.0.1:8000/machines`)

                if (!response.ok){
                    throw new Error("Failed to fetch machines");
                }

                const data: Machine[] = await response.json();
                setMachines(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong")
            } finally {
                setLoading(false)
            }
        };

    useEffect(() => {

        fetchMachines().catch(console.error);
    }, [], )

    if (loading) {
        return <p>Loading machines...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }


    return (
        <div>
            <input
            value = {machineSearch}
            onChange={event => setMachineSearch(event.target.value)}
            />
            <p>{displayedMachines.length}</p>
            {displayedMachines.map(machine => 
                (<p key = {machine.id}> 
                {machine.id} - {machine.status} 
                <button onClick={() => updateMachine(machine.id, machine.status == "online" ? "offline" : "online")}></button>
                </p>
                
            ))}

            <button onClick={()=>setShowOnlyOnline(!showOnlyOnline)}>
               {showOnlyOnline ? "Show All" : "Show Only Online"} 
            </button>

            

        </div>

    )

    }
    export default MachineComponent
