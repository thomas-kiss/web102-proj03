import { useState } from 'react'
import './App.css'

function App() {
  const [currCat, setCurrCat] = useState(null)
  const [banList, setBanList] = useState([])

  const discoverCat = async () => {
    const headers = { 'x-api-key': import.meta.env.VITE_CAT_API_KEY }
    const breedsRes = await fetch('https://api.thecatapi.com/v1/breeds', { headers })
    const breeds = await breedsRes.json()
    const randomBreed = breeds[Math.floor(Math.random() * breeds.length)]
    const imgRes = await fetch(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${randomBreed.id}`,
      { headers }
    )
    const imgData = await imgRes.json()

    if (imgData.length > 0) {
      if (banList.includes(randomBreed.name) ||
          banList.includes(randomBreed.origin) ||
          banList.includes(randomBreed.temperament)) {
        discoverCat()
      } else {
        setCurrCat({ ...imgData[0], breed: randomBreed })
      }
    }
  }

  return (
    <div className="app">
      <h1>Veni Vici</h1>
      <div className="layout">
        <div className="main">
          <button className="clickable" onClick={discoverCat}>Discover a Cat</button>
          {currCat && (
            <>
              <img src={currCat.url} alt="Cat" />
              <p className="clickable" onClick={() => setBanList([...banList, currCat.breed.name])}>
                Breed: {currCat.breed.name}
              </p>
              <p className="clickable" onClick={() => setBanList([...banList, currCat.breed.origin])}>
                Origin: {currCat.breed.origin}
              </p>
              <p className="clickable" onClick={() => setBanList([...banList, currCat.breed.temperament])}>
                Temperament: {currCat.breed.temperament}
              </p>
            </>
          )}
        </div>
        <div className="ban-list">
          <h2>Ban List</h2>
          <ul>
            {banList.map((item, index) => (
              <li
                className="clickable"
                onClick={() => setBanList(banList.filter((_, i) => i !== index))}
                key={index}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
