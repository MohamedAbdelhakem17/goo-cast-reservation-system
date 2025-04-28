import React from 'react'

export default function useTimeConvert() {
    return ((time) => {
        const [hour, minute] = time.split(':');
        const hour12 = hour % 12 || 12;
        const amPm = hour < 12 ? 'AM' : 'PM';
        return `${hour12}:${minute} ${amPm}`;
    })
}
