import { addToolTip, removeToolTip } from "../../utils/tooltip";
import onElementAdded from "../../utils/onElementAdded";

let main;
let mainAside;
let asideOpen = localStorage.getItem("isAsideOpen");

onElementAdded('#mainAside', () => firstVerification());

export function updateAsideVisibility(){
    main = document.querySelector("#mainAppContainer");
    mainAside = document.querySelector("#mainAside");

    asideOpen == "true"
    ? hideAside(true)
    : showAside(true)
}

if(localStorage.getItem("isAsideOpen") === null){
    localStorage.setItem("isAsideOpen", "false");
}

// document.addEventListener("DOMContentLoaded", firstVerification);

function firstVerification(){
    main = document.querySelector("#mainAppContainer");
    mainAside = document.querySelector("#mainAside");

    if(window.innerWidth <= 500){
        hideAside(false)
    }

    if(asideOpen == "true"){
        showAside(false)
    } else {
        hideAside(false)
    }
}

function showAside(animation){
    asideOpen = "true";
    localStorage.setItem("isAsideOpen", asideOpen);
    mainAside.style.overflow = "hidden";
    mainAside.querySelector("ul").style.padding = "0px 20px 0px 0px";
    if(animation){
        main.classList = "mainAsideOpen mainAsideOpenAnimation";
    } else{
        main.classList = "mainAsideOpen";
    }
    setTimeout(() => {
        mainAside.style.overflow = "auto";
    }, 310);

    // Removendo Tooltips no aside open
    const icons = document.querySelectorAll('#mainAside .material-symbols-rounded');
    if(icons){
        icons.forEach(icon => removeToolTip(icon));
    }
    const quickAddBtn = document.querySelector(".quickAddButtonContainer");
    removeToolTip(quickAddBtn);
}

function hideAside(animation){
    asideOpen = "false";
    localStorage.setItem("isAsideOpen", asideOpen);
    if(animation){
        main.classList = "mainAsideClosed mainAsideClosedAnimation";
    } else{
        main.classList = "mainAsideClosed";
    }
    
    setTimeout(() => {
        if(hasOverflow(mainAside)){
            mainAside.querySelector("ul").style.padding = "0px 6px";
        } else{
            mainAside.querySelector("ul").style.padding = "0px 10px";
        }
    }, 200)
    
    // Adicionando Tooltips no aside closed
    const icons = document.querySelectorAll('#mainAside .material-symbols-rounded');
    if(icons){
        icons.forEach(icon => addToolTip(icon, "RIGHT"));
    }
    const quickAddBtn = document.querySelector(".quickAddButtonContainer");
    addToolTip(quickAddBtn, "RIGHT");
}

function hasOverflow(element) {
    // const hasHorizontalOverflow = element.scrollWidth > element.clientWidth;
    const hasVerticalOverflow = element.scrollHeight > element.clientHeight;
  
    return hasVerticalOverflow; // hasHorizontalOverflow || hasVerticalOverflow
}