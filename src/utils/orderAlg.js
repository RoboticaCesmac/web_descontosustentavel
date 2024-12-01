export default function orderArray(array, orderField, orderDirection){
    if(orderField.includes('.')){
        let orderField1 = orderField.split('.')[0];
        let orderField2 = orderField.split('.')[1];
        return array.sort((a, b) => {
            if(Number(a[orderField1][orderField2]) || typeof a[orderField1][orderField2] == "boolean"){
                return orderDirection === 'asc' 
                ? Number(a[orderField1][orderField2]) - Number(b[orderField1][orderField2])
                : Number(b[orderField1][orderField2]) - Number(a[orderField1][orderField2])
            } else if (typeof a[orderField1][orderField2] === 'string') {
                return orderDirection === 'asc' 
                ? a[orderField1][orderField2].localeCompare(b[orderField1][orderField2])
                : b[orderField1][orderField2].localeCompare(a[orderField1][orderField2])
            }
        });
    }
    
    return array.sort((a, b) => {
        if(Number(a[orderField]) || typeof a[orderField] == "boolean"){
            return orderDirection === 'asc' 
                ? Number(a[orderField]) - Number(b[orderField])
                : Number(b[orderField]) - Number(a[orderField])
        } else if (typeof a[orderField] === 'string') {
            return orderDirection === 'asc' 
                ? a[orderField].localeCompare(b[orderField])
                : b[orderField].localeCompare(a[orderField])
        }
    });
}