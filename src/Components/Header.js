import './Header.css';


export default function Header(){

    function scrollUp(){
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
    return(
        <div className="header">
            <ul>
                <a href='/'>Refresh</a>
                <p onClick={scrollUp}>Back to top</p>
            </ul>
        </div>
    )
}