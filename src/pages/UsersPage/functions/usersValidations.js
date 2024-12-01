export default function validateUser(user){
    const { name, userType } = user;
    const {cep, state, city, neighborhood, street, number, complement, establishmentName} = user;

    // Client and Retailer
    if(!name) throw new Error('O nome é obrigatório.');
    
    if(name.length < 3) throw new Error('Nome inválido.');

    if(name.length > 150) throw new Error('Os campos não podem conter mais de 150 caracteres.');

    // Retailer
    if(userType === 'RETAILER'){
        if(!state) throw new Error('Escolha um estado.');

        if(!cep || !city || !neighborhood || !number || !street) throw new Error('Preencha os campos obrigatórios.');

        const cepRegex = /^[0-9]{5}-[0-9]{3}$/;
        if(!cepRegex.test(cep)) throw new Error('Formato correto de CEP: "12345-678".');

        if(number.length > 10) throw new Error('O Número não pode possuir mais de 10 caracteres.');

        if(city.length > 150 || street.length > 150 || neighborhood.length > 150 || complement.length > 150 || establishmentName.length > 150) throw new Error('Os campos não podem conter mais de 150 caracteres.');
    }

    return;
}