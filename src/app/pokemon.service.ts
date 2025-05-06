import { inject, Injectable } from '@angular/core';
import { POKEMON_LIST } from './pokemon-list.fake';
import { Pokemon, PokemonList } from './pokemon.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {
    readonly #POKEMON_API_URL = 'http://localhost:3000/pokemons';
    readonly #http = inject(HttpClient);
  
  // getPokemonList(): PokemonList {
  //   return POKEMON_LIST;
  // }

  getPokemonList(): Observable<PokemonList> {
   return this.#http.get<PokemonList>(this.#POKEMON_API_URL);
  }

  // getPokemonById(id: number): Pokemon {
  //   const pokemon = POKEMON_LIST.find((pokemon) => pokemon.id === id);
  //   if(!pokemon) {
  //     throw new Error(`No Pokemon found with id ${id}`);
  //   }

  getPokemonById(id: number): Observable<Pokemon> {
    const url = this.#POKEMON_API_URL + '/' + id;
    return this.#http.get<Pokemon>(url);
  }

  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    const url = this.#POKEMON_API_URL + '/' + pokemon.id;
    return this.#http.put<Pokemon>(url, pokemon);
  }

  deletePokemon(id: number): Observable<void> {
    const url = this.#POKEMON_API_URL + '/' + id;
    return this.#http.delete<void>(url);
  };

  addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon> {
    return this.#http.post<Pokemon>(this.#POKEMON_API_URL, pokemon);
  }

  getPokemonTypeList():string[] {
    return [
      'Plante', 
      'Feu',
      'Eau', 
      'Insecte',
      'Normal',
      'Electrik',
      'Poison',
      'Fée',
      'Vol'
    ];
  }
}
