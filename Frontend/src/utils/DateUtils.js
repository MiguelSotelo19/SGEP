export const isPastEvent = (eventDate) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    // Compara solo día, mes y año (ignorando horas)
    return eventDateObj.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
};

export const isToday = (eventDate) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    return (
        eventDateObj.getFullYear() === today.getFullYear() &&
        eventDateObj.getMonth() === today.getMonth() &&
        eventDateObj.getDate() === today.getDate()
    );
};

export const shouldDisableRegistration = (eventDate) => {
    return isPastEvent(eventDate) || isToday(eventDate);
};