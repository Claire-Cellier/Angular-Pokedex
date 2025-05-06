import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonService } from '../../pokemon.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getPokemonColor, POKEMON_RULES } from '../../pokemon.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';


@Component({
  selector: 'app-pokemon-edit',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './pokemon-edit.component.html',
  styles: ``,
})

export class PokemonEditComponent {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly pokemonService = inject(PokemonService);
  readonly pokemonId = Number(this.route.snapshot.paramMap.get('id'));

  // gestion erreur http
 readonly #pokemonResponse = toSignal(
  this.pokemonService.getPokemonById(this.pokemonId).pipe(
    map((pokemon) => ({ value:pokemon, error: undefined})),
    catchError((error) => of({value: undefined, error: error}))
 ));

 readonly loading = computed(() => this.#pokemonResponse() === undefined);
 readonly error = computed(() => this.#pokemonResponse()?.error)

 readonly pokemon = computed(() =>this.#pokemonResponse()?.value);

//  readonly pokemonId = signal(
//   Number(this.route.snapshot.paramMap.get('id'))
// ).asReadonly();
  // readonly pokemon = signal(
  //   this.pokemonService.getPokemonById(this.pokemonId())
  // ).asReadonly();
  //
  // readonly pokemon = toSignal(
  //   this.pokemonService.getPokemonById(this.pokemonId())
  // );
  
  readonly POKEMON_RULES = POKEMON_RULES;

  readonly form = new FormGroup({
    // name: new FormControl(this.pokemon().name, [
    //   Validators.required,
    //   Validators.minLength(POKEMON_RULES.MIN_NAME),
    //   Validators.maxLength(POKEMON_RULES.MAX_NAME),
    //   Validators.pattern(POKEMON_RULES.NAME_PATTERN),
    // ]),
    // life: new FormControl(this.pokemon().life),
    // damage: new FormControl(this.pokemon().damage),
    // types: new FormArray(this.pokemon().types.map((type) => new FormControl(type)), 
    // [
    //   Validators.required, // au moins un type sélectionné
    //   Validators.maxLength(POKEMON_RULES.MAX_TYPES),
    // ]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(POKEMON_RULES.MIN_NAME),
      Validators.maxLength(POKEMON_RULES.MAX_NAME),
      Validators.pattern(POKEMON_RULES.NAME_PATTERN),
    ]),
    life: new FormControl<number | any>(''),
    damage: new FormControl<number | any>(''),
    types: new FormArray(
      [], 
      [
        Validators.required, // au moins un type sélectionné
        Validators.maxLength(POKEMON_RULES.MAX_TYPES),
      ]),
  });

  constructor() {
    effect(() => {
      const pokemon = this.pokemon();

      if(pokemon) {
        this.form.patchValue({
          name: pokemon.name,
          life: pokemon.life, 
          damage: pokemon.damage,
        });

        pokemon.types.forEach((type) => this.pokemonTypeList.push(new FormControl(type))
      );
      }
    })
  }

  get pokemonName() : FormControl {
    return this.form.get('name') as FormControl;
  }

  get pokemonLife() : FormControl {
    return this.form.get('life') as FormControl;
  }

  incrementLife() {
    const newValue = this.pokemonLife.value + 1;
    this.pokemonLife.setValue(newValue);
  }

  decrementLife() {
    const newValue = this.pokemonLife.value - 1;
    this.pokemonLife.setValue(newValue);
  }

  get pokemonDamage() : FormControl {
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

  // Accéder à la liste des champs contenus dans Form Array 
  // Pour connaître les types sélectionnés à la base 
  get pokemonTypeList(): FormArray {
    return this.form.get('types') as FormArray;
  }

  // Vérifier si oui ou non le type est déjà sélectionné
  isPokemonTypeSelected(type: string): boolean {
    return !!this.pokemonTypeList.controls.find((control) => control.value === type);
  }
  // find s'utilise avec soit un résultat soit un undifined
  // ici en mettant !! on le converti en boolean, resultat = true, undefined = false

  // Selon intéraction, vérifier si la case est cochée ou non et mise à jouur en conséquence
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

  // Adapter couleur du type
  getPokemonColor(type:string) {
    return getPokemonColor(type);
  }

  getChipTextColor(type:string): 'black' | 'white' {
    return type === 'Electrik' ? 'black' : 'white';
  }

  //Validation du formulaire
  onSubmit() {
    // console.log(this.form.value);
    const isFormValid = this.form.valid; 
    const pokemon = this.pokemon();

    if(isFormValid && pokemon){
      const updatadPokemon = {
        ...pokemon, 
        name: this.pokemonName.value, 
        life : this.pokemonLife.value, 
        damage: this.pokemonDamage.value,
        type: this.pokemonTypeList.value,
      }; 

      this.pokemonService.updatePokemon(updatadPokemon).subscribe(() => {
        this.router.navigate(['/pokemons', pokemon.id]);
      });      
    }
  }
}