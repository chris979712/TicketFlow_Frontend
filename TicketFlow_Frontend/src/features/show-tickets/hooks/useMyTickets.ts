import { useState, useEffect } from "react";
import { fetchMyTickets, type Ticket } from "../services/ticketService";

interface UseMyTicketsResult {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}

export function useMyTickets(refreshKey: number = 0): UseMyTicketsResult {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTickets() {
      setLoading(true);
      const data = await fetchMyTickets();
      
      if (data.length === 0) {        
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Sesión expirada. Inicie sesión nuevamente.");
        }
      }

      setTickets(data);
      setLoading(false);
    }

    loadTickets();
  }, [refreshKey]); 

  return { tickets, loading, error };
}

