import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../apis/BASE_URL';

export default function PageTracker() {
    const location = useLocation();
    const enterTime = useRef(performance.now());
    const prevPath = useRef(location.pathname);

    const getQueryParams = () => {
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash?.split('?')[1]);
            return params.get('step');
        }
        return null;
    };

    const sendAnalytics = async (data) => {
        try {
            await axios.post(BASE_URL + '/analytics', data);
        } catch (error) {
            console.error('Error sending analytics data:', error);
        }
    };

    useEffect(() => {
        const leaveTime = performance.now();
        const timeSpent = leaveTime - enterTime.current;

        const step = getQueryParams();

        const analyticsData = {
            prevPath: prevPath.current,
            timeSpent,
            timestamp: new Date().toISOString(),
        };

        if (step) {
            analyticsData.prevPath = `${location.pathname}?step=${step}`;
        }

        // sendAnalytics(analyticsData);


        enterTime.current = leaveTime;
        prevPath.current = location.pathname;
    }, [location]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            const leaveTime = performance.now();
            const timeSpent = leaveTime - enterTime.current;

            const step = getQueryParams();

            const analyticsData = {
                prevPath: prevPath.current,
                timeSpent,
                timestamp: new Date().toISOString(),
            };

            if (step) {
                analyticsData.prevPath = `${location.pathname}?step=${step}`;
            }

            sendAnalytics(analyticsData);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}
