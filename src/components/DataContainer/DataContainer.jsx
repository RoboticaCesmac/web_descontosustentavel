import { forwardRef, useEffect, useState } from 'react';
import './DataContainer.css'
import useCalcDataContainerHeight from '../../hooks/useCalcDataContainerHeight';

const DataContainer = forwardRef((props, ref) => {
    const { viewType, children, style, refsToCalcHeight } = props;

    const { calcDataContainerHeight } = useCalcDataContainerHeight();
    const [dataContainerHeight, setDataContainerHeight] = useState(0);

    useEffect(() => {
        // Calcular a altura máxima do dataContainer
        if(!refsToCalcHeight) return;

        const componentsToCalcHeight = [];
        for(const element of refsToCalcHeight){
            if(element.current) componentsToCalcHeight.push(element.current);
        }

        setDataContainerHeight(calcDataContainerHeight(componentsToCalcHeight));
    }, [refsToCalcHeight]);
    
    function handleScroll(e){
        const thead = e.target.querySelector("thead");
        if(e.target.scrollTop > 10){
            thead ? thead.style.boxShadow = "0px 2px 6px 0px lightgray" : null;
        } else {
            thead ? thead.style.boxShadow = "none" : null;
        }

    }

    return (
        <div id='dataContainer' className="dataContainer" style={{height: dataContainerHeight, marginBottom: 10}} onScroll={handleScroll}>
            {viewType ===  'list' &&
                <table className="table">
                    {children}
                </table>
            }
            {viewType ===  'grid' &&
                <div className="dataInGridViewContainer">
                    {children}
                </div>
            }
        </div>
    )
});

export default DataContainer;
