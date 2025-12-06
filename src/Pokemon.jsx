import { useEffect, useState } from "react";
import "./index.css";
import { PokemonCards } from "./PokemonCard";

export const Pokemon = () => {
  const [poki, setPoki] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const API = "https://pokeapi.co/api/v2/pokemon?limit=120";

  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const detailedPokemonData = data.results.map(async (curPokemon) => {
        const res = await fetch(curPokemon.url);
        const data = await res.json();
        return data;
      });

      const detailedResponse = await Promise.all(detailedPokemonData);
      setPoki(detailedResponse);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(err);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const searchData = poki.filter((curvalue) =>
    curvalue.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div>
        <h1>Loading.....</h1>
      </div>
    );

  if (error)
    return (
      <div>
        <h1>Error Found : {error.message}</h1>
      </div>
    );
  return (
    <>
      <section className="container">
        <header>
          <h1>Let's Catch Pokemons</h1>
        </header>
        <div className="pokemon-search">
          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <ul className="cards">
            {searchData.map((curPokemon) => {
              return (
                <PokemonCards key={curPokemon.id} pokemonData={curPokemon} />
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
};
