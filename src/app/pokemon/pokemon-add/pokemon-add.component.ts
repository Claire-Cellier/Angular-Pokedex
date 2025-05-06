import { Component, inject } from '@angular/core';
import { getPokemonColor, Pokemon, POKEMON_RULES } from '../../pokemon.model';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PokemonService } from '../../pokemon.service';

@Component({
  selector: 'app-pokemon-add',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './pokemon-add.component.html',
  styles: ``,
})
export class PokemonAddComponent {
  readonly router = inject(Router);
  readonly pokemonService = inject(PokemonService);

  readonly POKEMON_RULES = POKEMON_RULES

  readonly form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(POKEMON_RULES.MIN_NAME),
      Validators.maxLength(POKEMON_RULES.MAX_NAME),
      Validators.pattern(POKEMON_RULES.NAME_PATTERN),
    ]),
    life: new FormControl<number | any>(10),
    damage: new FormControl<number | any>(1),
    types: new FormArray(
      [new FormControl('Normal')],
      [
        Validators.required,
        Validators.maxLength(POKEMON_RULES.MAX_TYPES),
      ]),
    picture: new FormControl<string | any>('', [
      Validators.required,
    ]),
  });

  onSubmit() {
    // Marquer les champs en 'dirty" permet de déclencher l'affichage
    // des messages d'erreur pour les champs invalides
    // que l'utilisateur n'aurait pas encore modifiés.
    this.pokemonName.markAsDirty();
    this.pokemonPicture.markAsDirty();

    if (this.form.invalid) {
      return;
    }

    const pokemon: Omit<Pokemon, 'id'> = {
      name: this.pokemonName.value,
      picture: this.pokemonPicture.value,
      life: this.pokemonLife.value,
      damage: this.pokemonDamage.value,
      types: this.pokemonTypeList.controls.map(control => control.value) as 
      [string] | [string, string] | [string, string, string],
      created: new Date()
    };

    this.pokemonService.addPokemon(pokemon).subscribe((pokemonAdded) => {
      this.router.navigate(['/pokemon', pokemonAdded.id])
    })
  }

  get pokemonName(): FormControl {
    return this.form.get('name') as FormControl;
  };

  get pokemonPicture(): FormControl {
    return this.form.get('picture') as FormControl;
  }

  get pokemonLife(): FormControl {
    return this.form.get('life') as FormControl;
  };

  incrementLife() {
    const newValue = this.pokemonLife.value + 1;
    this.pokemonLife.setValue(newValue);
  }

  decrementLife() {
    const newValue = this.pokemonLife.value - 1;
    this.pokemonLife.setValue(newValue);
  }

  get pokemonDamage(): FormControl {
    return this.form.get('damage') as FormControl;
  }

  incrementDamage() {
    const newValue = this.pokemonDamage.value + 1;
    this.pokemonDamage.setValue(newValue);
  }

  decrementDamage() {
    const newValue = this.pokemonDamage.value - 1;
    this.pokemonDamage.setValue(newValue);
  }

  get pokemonTypeList(): FormArray {
    return this.form.get('types') as FormArray;
  }

  isPokemonTypeSelected(type: string): boolean {
    return !!this.pokemonTypeList.controls.find((control) => control.value === type);
  }

  onPokemonTypeChange(type: string, isCkecked: boolean) {
    if (isCkecked) {
      const control = new FormControl(type);
      this.pokemonTypeList.push(control);
    }
    else {
      const index = this.pokemonTypeList.controls
        .map((control) => control.value)
        .indexOf(type);

      this.pokemonTypeList.removeAt(index)
    }
  }

  getPokemonColor(type: string) {
    return getPokemonColor(type);
  }
}
