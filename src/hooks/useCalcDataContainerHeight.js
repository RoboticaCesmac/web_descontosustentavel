export default function useCalcDataContainerHeight() {

    function calcDataContainerHeight(elements){
        if(!elements || elements.length === 0) return;
        const mainHeader = document.querySelector("#mainHeader");
        const maxHeight = getElementsYSize([...elements, mainHeader]);
        return window.innerHeight - maxHeight - 20; // o 20 seria um padding bottom;
    }

  return { calcDataContainerHeight }
}

function getElementsYSize(elements){
    let sum = 0;

    for (const element of elements){
        const elementComputedStyle = getComputedStyle(element);
    
        sum += formatPixelInNumber(elementComputedStyle.height);
        sum += formatPixelInNumber(elementComputedStyle.paddingTop);
        sum += formatPixelInNumber(elementComputedStyle.paddingBottom);
        sum += formatPixelInNumber(elementComputedStyle.marginTop);
        sum += formatPixelInNumber(elementComputedStyle.marginBottom);
    }

    return sum;
}

function formatPixelInNumber(value){
    return Number(value.replace("px", ""));
}