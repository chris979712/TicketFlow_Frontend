// Hardcoded IDs based on the exact seed order.
// Make sure your SQL seed inserts in this order with an empty table:
// 1. draft, 2. scheduled, 3. on_sale, 4. paused,
// 5. edit_lock, 6. closed, 7. completed, 8. canceled
type EventStatusId = keyof typeof EVENT_STATUS_ID_TO_CODE;
type EventLocationId = keyof typeof EVENT_LOCATIONS_ID_TO_CODE_LABEL;
export type EventStatus = keyof typeof EVENT_STATUS;

export const EVENT_STATUS = Object.freeze({
    DRAFT: 1,
    SCHEDULED: 2,
    ON_SALE: 3,
    PAUSED: 4,
    EDIT_LOCK: 5,
    CLOSED: 6,
    COMPLETED: 7,
    CANCELED: 8,
});

export const EVENT_STATUS_CODE = Object.freeze({
    draft: EVENT_STATUS.DRAFT,
    scheduled: EVENT_STATUS.SCHEDULED,
    on_sale: EVENT_STATUS.ON_SALE,
    paused: EVENT_STATUS.PAUSED,
    edit_lock: EVENT_STATUS.EDIT_LOCK,
    closed: EVENT_STATUS.CLOSED,
    completed: EVENT_STATUS.COMPLETED,
    canceled: EVENT_STATUS.CANCELED,
});

export const EVENT_STATUS_ID_TO_CODE = Object.freeze({
    [EVENT_STATUS.DRAFT]: "draft",
    [EVENT_STATUS.SCHEDULED]: "scheduled",
    [EVENT_STATUS.ON_SALE]: "on_sale",
    [EVENT_STATUS.PAUSED]: "paused",
    [EVENT_STATUS.EDIT_LOCK]: "edit_lock",
    [EVENT_STATUS.CLOSED]: "closed",
    [EVENT_STATUS.COMPLETED]: "completed",
    [EVENT_STATUS.CANCELED]: "canceled",
});

export const RESERVATION_STATUS = Object.freeze({
    ACTIVE: "active",
    EXPIRED: "expired",
    CONVERTED: "converted",
    CANCELED: "canceled",
});

export const RESERVATION_STATUS_LIST = Object.freeze([
    RESERVATION_STATUS.ACTIVE,
    RESERVATION_STATUS.EXPIRED,
    RESERVATION_STATUS.CONVERTED,
    RESERVATION_STATUS.CANCELED,
]);

export function isValidReservationStatus(value: any) {
    return RESERVATION_STATUS_LIST.includes(value);
}

export const isOnSale = (eventStatusId: number) => eventStatusId === EVENT_STATUS.ON_SALE;
export const isEditLocked = (eventStatusId: number) => eventStatusId === EVENT_STATUS.EDIT_LOCK;
export const canSell = (eventStatusId: number) => eventStatusId === EVENT_STATUS.ON_SALE;
export const canEditStructure = (eventStatusId: number) => eventStatusId === EVENT_STATUS.DRAFT || eventStatusId === EVENT_STATUS.EDIT_LOCK;

export const EVENT_STATUS_LABEL = Object.freeze({
    draft: "Borrador",
    scheduled: "Programado",
    on_sale: "A la venta",
    paused: "Pausado",
    edit_lock: "Edición bloqueada",
    closed: "Cerrado",
    completed: "Completado",
    canceled: "Cancelado",
});

export const EVENT_STATUS_ID_TO_CODE_LABEL = Object.freeze({
    1: "draft",
    2: "scheduled",
    3: "on_sale",
    4: "paused",
    5: "edit_lock",
    6: "closed",
    7: "completed",
    8: "canceled",
});

export const EVENT_LOCATIONS_LABEL = Object.freeze({
    teatro_aurora: "Teatro Aurora",
    auditorio_reforma: "Auditorio Reforma"
})

export const EVENT_LOCATIONS_ID_TO_CODE_LABEL = Object.freeze({
    1: "teatro_aurora",
    2: "auditorio_reforma",
});

export function GetEventStatusLabel(eventStatus: number){
    const Status_ID = eventStatus as EventStatusId;
    const code = EVENT_STATUS_ID_TO_CODE[Status_ID];
    return EVENT_STATUS_LABEL[code] ?? "Desconocido";
}

export function GetEventLocation(eventLocation: number){
    const Location_ID = eventLocation as EventLocationId;
    const code = EVENT_LOCATIONS_ID_TO_CODE_LABEL[Location_ID];
    return EVENT_LOCATIONS_LABEL[code] ?? "Desconocido"
}



