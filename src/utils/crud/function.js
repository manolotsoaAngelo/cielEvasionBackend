///import { tri_reportByASC_ref,tri_ebilletByASC_ref,tri_ebilletByASC_Date} from '../utils/crud/function.js';

export function tri_ebilletByASC_Date(array_result) {
    return [...array_result].sort((a, b) => {
        const dateA = new Date(a.datePriseRdvClient).getTime();
        const dateB = new Date(b.datePriseRdvClient).getTime();
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        return 0;
    });
}

export function tri_reportByASC_ref(result) {
    let array_result = []
    let seen = new Set();
    for (let item of result) {
        let array_ref = [];
        let [prefixA] = item.ref.split("-");
        for (let itemB of result) {
            let [prefixB] = itemB.ref.split("-");
            if (prefixA === prefixB && !array_ref.includes(itemB)) {
                array_ref.push(itemB);
            }
        }
        array_ref.sort((a, b) => a.ref.localeCompare(b.ref));
        if (!seen.has(prefixA)) {
            array_result = array_result.concat(array_ref);
            seen.add(prefixA);
        }
    }
    return array_result
}