
export default function useVAT() {
    const VAT_PERCENTAGE = 14;


    const calculateVAT = (total) => {
        const vat = +(total * (VAT_PERCENTAGE / 100)).toFixed(2);
        return vat
    };

    return { calculateVAT, VAT_PERCENTAGE };
}
