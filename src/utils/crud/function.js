///import { tri_reportByASC_ref } from '../utils/crud/function.js';

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