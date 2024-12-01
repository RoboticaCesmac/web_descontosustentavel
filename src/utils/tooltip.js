export function addToolTip(element, pos = "BOTTOM") {
    const boundFunction = handleMouseOverTooltip.bind(null, element, pos);
    element.addEventListener('mouseover', boundFunction);
    element.boundMouseOver = boundFunction;
}

export function removeToolTip(element) {
    element.removeEventListener('mouseover', element.boundMouseOver);
}

function handleMouseOverTooltip(element, pos){
    // Cria o tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = element.getAttribute("aria-label");
  
    document.body.appendChild(tooltip);
  
    const rect = element.getBoundingClientRect();

    switch(pos){
        case "BOTTOM":
            tooltip.style.left = `${rect.left}px`;
            tooltip.style.top = `${rect.bottom + 5}px`;
            break;
        case "RIGHT":
            tooltip.style.left = `${rect.left + 35}px`;
            tooltip.style.top = `${rect.bottom - 25}px`;
            break;
        default:
            break;
    }
    
    setTimeout(() => {
      tooltip.style.opacity = '1';
    }, 10);
  
    element.addEventListener('mouseout', () => {
        tooltip.style.opacity = '0';
        document.body.removeChild(tooltip);
    }, { once: true }); // Garante que o evento ocorra apenas uma vez
}