export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

export const formatDateLong = (date: Date): string => {
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
};

export const calculateDaysBetween = (d1: Date, d2: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(d1);
    const secondDate = new Date(d2);
    // Use Math.round to check diff
    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
};
