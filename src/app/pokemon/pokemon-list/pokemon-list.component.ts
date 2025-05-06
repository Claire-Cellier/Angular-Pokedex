import { Component, computed, inject, signal } from '@angular/core';
import { PokemonService } from '../../pokemon.service';
import { Pokemon } from '../../pokemon.model';
import { PokemonBorderDirective } from '../../pokemon-border.directive';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-pokemon-list',
  imports: [PokemonBorderDirective, DatePipe, RouterLink],
  templateUrl: './pokemon-list.component.html',
  styles: `.pokemon-card{ cursor:pointer }`
})
export class PokemonListComponent {
  readonly #pokemonService = inject(PokemonService); // # veut dire private
  readonly pokemonList = toSignal(this.#pokemonService.getPokemonList(), {
    initialValue: [],
  })
  readonly searchTerm = signal('');

// signal pour afficher une nouvelle liste de pokémon selon notre recherche
  readonly pokemonListFiltered = computed(() => {
    const searchTerm = this.searchTerm();
    const pokemonList = this.pokemonList();
    // signaux dont dépendent mon signal de filtre

    return pokemonList.filter((pokemon) => 
      pokemon.name.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    // .trim() = supprimer les espaces
  });

  readonly loading = computed(() => this.pokemonList().length === 0);

  size (pokemon: Pokemon){
    if (pokemon.life < 16) {
      return "Petit";
    };

    if (pokemon.life > 24) {
      return "Grand";
    };

    return "Moyen";
  }
}
