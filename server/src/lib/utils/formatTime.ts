// noinspection JSCheckFunctionSignatures

import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date: Date) {
    return format(new Date(date), 'dd MMMM yyyy');
}

export function fddMMYYYYWithSlash(date: Date) {
    return format(new Date(date), 'dd/MM/yyyy');
}

export function fYearMonthDay(date: Date) {
    return format(new Date(date), 'yyyy/MM/dd');
}

export function fDateTime(date: Date) {
    return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fTimestamp(date: Date) {
    return getTime(new Date(date));
}

export function fDateTimeSuffix(date: Date) {
    return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date: Date) {
    return formatDistanceToNow(new Date(date), {
        addSuffix: true,
    });
}

export function getNextNDay(no: number) {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + no);
    return nextDay;
}

export function fDateTimeDayMonYear(date: Date) {
    return format(new Date(date), 'dd-MM-yy');
}

export function fDateTimeYearMonDay(date: Date) {
    return format(new Date(date), 'yyyy-MM-dd');
}

export function getNextNDayFromDate(date: Date, no: number) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + no);
    return nextDay;
}

export function fDateTimeForInvoiceNoDayMonYear(date: Date) {
    return format(new Date(date), 'dd.MM.yy');
}
