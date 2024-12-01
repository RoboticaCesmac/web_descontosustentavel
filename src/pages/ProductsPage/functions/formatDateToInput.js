export default function formatDateToInput(data){
    const date = new Date(data);
    
    const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    const year = date.getFullYear();
    console.log(`${year}-${month}-${day}`);

    return `${year}-${month}-${day}`
}