import onElementAdded from "../../utils/onElementAdded";

onElementAdded("#dataContainer", () => {
    const main = document.querySelector("#mainAppContainer");
    const mainHeader = document.querySelector("#mainHeader");

    // Setando a altura máxima do Main
    if(main){
        main.style.height = `calc(100vh - ${getComputedStyle(mainHeader).height})`;
    }
})