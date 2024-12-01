export function loadInputSugestions(entity, searchKey, filterKey = null, filter = null){
    
    // Criar o elemento datalist
    document.querySelector(`#${entity.id}`)?.remove();
    const datalist = document.createElement('datalist');
    datalist.id = entity.id; // Define o id do datalist para associá-lo ao input
    
    // Adicionar opções ao datalist
    let alreadyAdd = []
    entity.forEach((element) => {
        const option = document.createElement('option');
        if(filter && filterKey){
            if(element[filterKey] == filter){
                if(!alreadyAdd.includes(element[searchKey])){
                    alreadyAdd.push(element[searchKey]);
                    option.value = element[searchKey]; // Define o valor da opção
                    option.innerHTML = element[searchKey]
                }
            }
        } else{
            if(!alreadyAdd.includes(element[searchKey])){
                alreadyAdd.push(element[searchKey]);
                option.value = element[searchKey]; // Define o valor da opção
                option.innerHTML = element[searchKey]
            }
        }
        datalist.appendChild(option); // Adiciona a opção ao datalist
    });

    
    // Adiciona o datalist ao body (ou a outro elemento)
    document.body.appendChild(datalist);
    
    // Anexa o input ao datalist
    document.querySelector("#searchInput").setAttribute("list", entity.id)
}