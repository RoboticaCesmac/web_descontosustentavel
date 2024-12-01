import './MainContainer.css'

export default function MainContainer(props) {
    const { children } = props;

    return (
        <div id='mainContainer'>
            {children}
        </div>
    )
}
