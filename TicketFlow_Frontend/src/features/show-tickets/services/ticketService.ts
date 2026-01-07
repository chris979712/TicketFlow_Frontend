import axios from "axios";
import { type ApiResponse } from "../../../schemas/api";
import { useSessionHandler } from "../../../hooks/useSessionHandler";
const API_URL = import.meta.env.VITE_API_URL;
const {GetTokenCookie} = useSessionHandler();

export interface Ticket {
  eventId: number;
  ticketId: number;        
  title: string;
  date: string;
  location: string;
}

export async function fetchMyTickets(): Promise<Ticket[]> {
  try {
    const token = GetTokenCookie();

    const response = await axios.get(`${API_URL}/v1/ticket/my-event`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const events = response.data?.events || [];    
    const tickets: Ticket[] = [];
    events.forEach((ev: any) => {
      ev.tickets?.forEach((tk: any) => {
        tickets.push({
          eventId: ev.event_id,
          ticketId: tk.ticket_id,
          title: ev.event_name,
          date: ev.event_date,
          location: `${ev.city} — ${ev.venue_name}`,
        });
      });
    });
    return tickets;
  } catch (error: any) {
    const status = error.response?.status || 0;
    let message = "Error desconocido al obtener tus tickets.";
    switch (status) {
      case 400:
        message = "Solicitud inválida.";
        break;
      case 401:
        message = "Sesión expirada, inicia sesión nuevamente.";
        break;
      case 404:
        message = "No se encontraron eventos con tickets para este usuario.";
        break;
      case 500:
        message = "Error interno del servidor.";
        break;
    }
    console.error("Error al obtener tickets:", message);
    return [];
  }
}

export async function getTicketQr(ticketId: number): Promise<ApiResponse> {
  try {
    const token = GetTokenCookie();

    const response = await axios.get(
      `${API_URL}/v1/ticket/${ticketId}/qr`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      status: response.status,
      data: response.data
    };
  } catch (error: any) {
    const status = error.response?.status || 0;
    let message = "Error desconocido.";

    switch (status) {
      case 400:
        message = "ID de boleto inválido o faltante.";
        break;
      case 401:
        message = "Sesión expirada. Vuelva a iniciar sesión.";
        break;
      case 403:
        message = "Solo un asistente puede ver el QR de sus boletos.";
        break;
      case 404:
        message = "No se encontró el boleto o no pertenece a este usuario.";
        break;
      case 500:
        message = "Error interno al obtener el QR del boleto.";
        break;
    }

    return {
      status,
      message,
    };
  }
}

export async function refundTicket(ticketId: number, reason: string): Promise<ApiResponse> {
  try {
    const token = GetTokenCookie();

    const response = await axios.post(
      `${API_URL}/v1/ticket/${ticketId}/refund`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      status: response.status,
      data: response.data,
    };

  } catch (error: any) {
    const status = error.response?.status || 0;
    let message = "Error desconocido al solicitar reembolso.";

    switch (status) {
      case 400:
        message = error.response?.data?.message || "Solicitud inválida.";
        break;
      case 401:
        message = "Sesión expirada, inicia sesión nuevamente.";
        break;
      case 404:
        message = "No se encontró el boleto o no pertenece al usuario autenticado.";
        break;
      case 409:
        message = error.response?.data?.message || "Este boleto ya tiene un reembolso.";
        break;
      case 500:
        message = "Error interno del servidor.";
        break;
    }

    return {
      status,
      message,
    };
  }
}
