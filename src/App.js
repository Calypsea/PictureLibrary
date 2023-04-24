
import React from 'react'
import './App.css';

import Header from "./Components/Header"
import Image from "./Components/Image"

import { createClient } from 'pexels'; //Pexels API dependency
//available because of 'npm install pexels --save'
//https://www.pexels.com/api/

function App() {

  const client = createClient('U5Dtvzxl2gOp12GDOgJ4FqrhNLNauKJmY51j6op1iI9AqtoMYbXom79d'); // API Authorization

  const [loading, setLoading] = React.useState(false);
  const [fetched, setFetched] = React.useState(false);
  const [favourite, setFavourite] = React.useState(false);


  const [data, setData] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [totalImages, setTotalImages] = React.useState(0);
  const [page, setPage] = React.useState(1);
  

  const fetchingAPI = () =>
  {
    const orientation = "landscape"; //to fit the screenshot's img measurements
    const query = "cats"; //i like cats :)

    setLoading(true);

    client.photos.search({query: query, orientation: orientation, page:page, per_page: 20,}) 
    .then(imgData => {
        if(totalImages !== 0 && page >= Math.ceil(totalImages / 20)){
          console.log("no more images to fetch") 
          return;
        }
        setData(prev => [...prev, ...imgData.photos])// allows newly fetched data to stack on old data
        setTotalImages(imgData.total_results)
    }) 
    .then(()=> {
      setFetched(true); //to make sure code doesn't try to map and render components before they're fetched
      setLoading(false);
    })
    .catch(error => {
      setErrorMessage("Unable to fetch data properly. Try again later");
      console.error(error);
      setLoading(false);
    });
  }
  
  React.useEffect( () => { //initial fetch on render + every page state change
    fetchingAPI();
  
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page])

  

  const saveToFavorites = (id, favourite) => { //expects an ID and the boolean state of an Image component that was clicked
    setFavourite(prevFavourites => {
      return {...prevFavourites, [id]: favourite};
    }); //setting or adding a new id and favourite value
    const favouritesLocal = JSON.parse(localStorage.getItem("favourites")) || {}; 

    favouritesLocal[id] = favourite; //updates id value to whatever it gets from the component
    localStorage.setItem("favourites", JSON.stringify(favouritesLocal)); //saves the updated object into storage
    
  }

  const favouritesLocal = JSON.parse(localStorage.getItem("favourites")) || {}; //for first render

  

  const imageElements = fetched && data.map(item => { //mapping over fetched array and rendering components
    return(
      <Image 
        key={item.id}
        item={item}
        favourite={favouritesLocal[item.id]} //saves info about whether a component is favourited
        saveToFavorites={saveToFavorites} //allows components to call it for local storage
      />
    )
  })
  
  const handleScroll = (e) =>{ //infinite scrolling, new fetch of data each time screen height and distance scrolled from top are equal to entire scrolled height.
    const eTarget = e.target; 
    if(window.innerHeight +  eTarget.documentElement.scrollTop + 1 >=  eTarget.documentElement.scrollHeight) 
    { // +1 and >= to avoid errors due to scrollTop not being an integer.
      setPage(prev => prev + 1); //this sets off the fetch useEffect.
    }
  }
  
  
  return (
    <div className="main" >
      <Header />
      <div className="library">
        {errorMessage}
        {imageElements}
      </div>
      {loading && <p className="loader">Loading..</p>}
    </div>
  );
}
//code by: Austeja Kazlauskaite, 2023, Vinted homework assignment
export default App;

