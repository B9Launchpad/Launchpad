// utils/formatDate.ts
import { TFunction } from 'react-i18next';

type RelativeDateResult = {
    key: string;
    params?: {
        weekday?: number;
        day?: number;
        month?: number;
        year?: number;
    };
};

/**
 * Getter function to retrieve `i18next` keys from date.
 * @param date instance of class `Date`.
 * @param now more recent instance of class Date, defaults to `new Date()`.
 * @returns keys usable in `i18next`
 */
function getRelativeDateInfo(date: Date, now: Date = new Date()): RelativeDateResult {
    const target = new Date(date);
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const diffDays = Math.floor((nowDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { key: 'date.today' };
    if (diffDays === 1) return { key: 'date.yesterday' };
    if (diffDays >= 2 && diffDays <= 6) {
        return { key: 'date.weekday', params: { weekday: target.getDay() } };
    }
    if (target.getFullYear() === now.getFullYear()) {
        return {
            key: 'date.sameYear',
            params: { day: target.getDate(), month: target.getMonth() },
        };
    }
    return {
          key: 'date.full',
          params: { day: target.getDate(), month: target.getMonth(), year: target.getFullYear() },
    };
}

/**
 * Formats a date as a relative string (e.g. "Today", "Yesterday", "Monday", "21 July", "21 July 2026").
 * @param date The date to format.
 * @param t The i18next translation function.
 * @param now Optional reference date (defaults to `new Date()`).
 * @returns The localized relative date string.
 */
export function formatRelativeDate(date: Date, t: TFunction, now?: Date): string {
  const info = getRelativeDateInfo(date, now);

  if (info.key === 'date.today' || info.key === 'date.yesterday') {
        return t(info.key);
  }

  if (info.key === 'date.weekday') {
        const weekdayName = t(`date.weekdays.${info.params!.weekday}`);
        return t(info.key, { weekday: weekdayName });
  }

    const monthName = t(`date.months.${info.params!.month}`);
    const day = info.params!.day;
    const year = info.params?.year;

  if (info.key === 'date.sameYear') {
        return t(info.key, { day, month: monthName });
  }

    return t(info.key, { day, month: monthName, year });
}

/**
 * Formats a date as an absolute full date (e.g. "21 July 2026").
 * @param date The date to format.
 * @param t The i18next translation function.
 * @returns The localised absolute date string.
 */
export function formatAbsoluteDate(date: Date, t: TFunction): string {
    const target = new Date(date);
    const day = target.getDate();
    const month = target.getMonth();
    const year = target.getFullYear();
    const monthName = t(`date.months.${month}`);
    return t('date.full', { day, month: monthName, year });
}

/**
 * Formats date into human readable `hh:mm` or `hh:mm:ss` time format.
 * @param date instance of `Date` class or timestamp.
 * @param includeSeconds will change output format to `hh:mm:ss`, defaults to `false`.
 * @returns `string` of `hh:mm` or `hh:mm:ss` time.
 */
export function formatTime(date: Date, includeSeconds: boolean = false): string {
    return date.getHours().toString().padStart(2, "0") 
        + ":" + 
        date.getMinutes().toString().padStart(2, "0")
        + (includeSeconds ? ":" + date.getSeconds().toString().padStart(2, "0") : "");
}