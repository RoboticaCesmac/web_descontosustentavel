export default function calcAlertLength(entity, filter, filterOpt = null, condicao){
    if(!filter) return entity.length;
    
    if(!filterOpt){
        return entity.filter((doc) => doc[filter] === condicao).length;
    }

    switch(filterOpt){
        case "==":
            return entity.filter((doc) => doc[filter] === condicao).length;
        case ">=":
            return entity.filter((doc) => doc[filter] >= condicao).length;
        case "<=":
            return entity.filter((doc) => doc[filter] <= condicao).length;
        case "!=":
            return entity.filter((doc) => doc[filter] != condicao).length;
        default:
            return entity.filter((doc) => doc[filter] === condicao).length;
    }
}