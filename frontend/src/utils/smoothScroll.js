export const smoothScroll = (delta, ref) => {
    const startScrollLeft = ref.current.getScrollLeft();
    const targetScrollLeft = startScrollLeft + delta;
    const distance = targetScrollLeft - startScrollLeft;
    const duration = 300; // duration in milliseconds
    let startTime = null;

    const animateScroll = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        ref.current.scrollLeft(startScrollLeft + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animateScroll);
        }
    };

    requestAnimationFrame(animateScroll);
};