const calculatePackagePrices = async ({ package, hours }) => {
    // check if package is fixed
    if (package.isFixed) {
        let result = [];
        for (let i = 1; i <= hours; i++) {
            result.push({
                endTime: i,
                totalPrice: package.price
            });
        }
        return result;
    }

    // check if package is hourly
    let result = [];
    let total = 0;

    for (let i = 1; i <= hours; i++) {
        const discount = package.perHourDiscounts.get(String(i)) || 0;
        const effectiveRate = package.price - discount;
        const priceToAdd = effectiveRate > 0 ? effectiveRate : 0;
        total += priceToAdd;

        result.push({
            endTime: i,
            totalPrice: total
        });
    }

    return result;
};
