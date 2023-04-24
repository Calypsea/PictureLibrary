
import './Image.css';
import React from 'react'

export default function Image(props){
    
    const {alt, photographer, src, id} = props.item;
    const [hovering, setHovering] = React.useState(false);
    const [favourite, setFavourite] = React.useState(props.favourite); 
    

    const styles = {
        backgroundColor: "rgba(255, 255, 255, 0.2)"
    }

    const handleMouseOver = () => {
        setHovering(true);
    };
    const handleMouseOut = () => {
        setHovering(false);
    };


    const handleFavourites = () => { //allows to toggle favourite button
        const newFavouriteState = !favourite; //since updating state is async, define it in a new variable that can be passed
        setFavourite(newFavouriteState);
        props.saveToFavorites(id, newFavouriteState);
      };
    
    return(
         <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} className="image_container">
            <img src={src.medium} alt={alt} className="images"/>
            {hovering && <div className="hovered_images overlay">
                <h4>{alt}</h4>
                <hr />
                <p> {photographer} </p>
                {!favourite ? <button onClick={handleFavourites}>Favourite</button>:
                <button onClick={handleFavourites} style={styles}>Un-favourite</button> }
            </div>}
        </div>
    )
}