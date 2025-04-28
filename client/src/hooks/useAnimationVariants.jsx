export const useAnimationVariants = () => {
    const slideIn = {
        hidden: {
            opacity: 0,
            x: 100,
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: 'easeOut',
            },
        },
        exit: {
            opacity: 0,
            x: 100,
            transition: {
                duration: 0.2,
                ease: 'easeIn',
            },
        },
    };

    return {
        slideIn,
    };
};