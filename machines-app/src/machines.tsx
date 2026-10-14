
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
    const [updatingId, setUpdatingId] = useState<string | null> (null)

    const updateMachine = async (id: string, newStatus: "online" | "offline") =>
    {
        setError(null);
        setUpdatingId(id)
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
            await fetchMachines() 
        }
        catch (err){
            setError(err instanceof Error ? err.message : "snth wrong")
        }
        finally {
            setUpdatingId(null)
        }
    }
    const fetchMachines = async () => {
            const response = await fetch (`http://127.0.0.1:8000/machines`)

            if (!response.ok){
                throw new Error("Failed to fetch machines");
             }

            const data: Machine[] = await response.json();
            setMachines(data)
        };

    const loadMachines = async () =>{
        try {
            await fetchMachines()
        }
        catch (err){
            setError(err instanceof Error ? err.message : "error")
        }
        finally {
            setLoading(false)
        }
    }

    useEffect (() => {
        loadMachines();
    }, [] )

    if (loading) {
        return <p>Loading machines...</p>;
    }



    return (
        <div>
            {error && <p style = {{color : "red"}}> Error : {error}</p>}
            {error && <button onClick={()=> loadMachines()}> Reload </button>}
            <input
            value = {machineSearch}
            onChange={event => setMachineSearch(event.target.value)}
            />
            <p>{displayedMachines.length}</p>
            {displayedMachines.map(machine => 
                (<p key = {machine.id}> 
                {machine.id} - {machine.status} 
                <button 
                disabled = {updatingId == machine.id}
                onClick={() => updateMachine(machine.id, machine.status == "online" ? "offline" : "online")}
                >
                {updatingId === machine.id ? "Updating...": "Change Status"}

                </button>
                </p>
                
            ))}

            <button onClick={()=>setShowOnlyOnline(!showOnlyOnline)}>
               {showOnlyOnline ? "Show All" : "Show Only Online"} 
            </button>
            

            

        </div>

    )

    }
    export default MachineComponent
