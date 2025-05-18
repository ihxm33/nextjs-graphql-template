document.addEventListener('DOMContentLoaded', () => {
    const billingToggle = document.getElementById('billingToggle');
    const monthlySpan = document.querySelector('.billing-toggle .monthly');
    const annuallySpan = document.querySelector('.billing-toggle .annually');
    const priceElements = document.querySelectorAll('.price .amount');

    // Price configurations
    const prices = {
        free: { monthly: 0, annually: 0 },
        pro: { monthly: 29, annually: 279 },
        enterprise: { monthly: 'Custom', annually: 'Custom' }
    };

    function updatePrices(isAnnual) {
        // Update toggle active state
        monthlySpan.classList.toggle('active', !isAnnual);
        annuallySpan.classList.toggle('active', isAnnual);

        // Update prices
        priceElements.forEach((element, index) => {
            const plan = index === 0 ? 'free' : (index === 1 ? 'pro' : 'enterprise');
            const price = prices[plan][isAnnual ? 'annually' : 'monthly'];
            
            if (typeof price === 'number') {
                element.textContent = `$${price}`;
            } else {
                element.textContent = price;
            }
        });
    }

    // Initialize with monthly prices
    updatePrices(false);

    // Handle toggle changes
    billingToggle.addEventListener('change', (e) => {
        updatePrices(e.target.checked);
    });
});
