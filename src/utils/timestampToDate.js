export default function timestampToDate(timestamp, toLocaleString = true){
    const ts = (timestamp.seconds + (timestamp.nanoseconds / 1000000000)) * 1000;

    if(!toLocaleString) return ts;

    const formattedDate = new Date(ts).toLocaleDateString("PT-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return formattedDate;
}