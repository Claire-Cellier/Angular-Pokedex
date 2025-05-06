import { Directive, ElementRef, HostListener, input } from '@angular/core';
import { getPokemonColor } from './pokemon.model';

@Directive({
  selector: '[appPokemonBorder]',
  standalone: true,
})
export class PokemonBorderDirective {
  pokemonType = input.required<string>();
  private readonly initialColor: string;

  constructor(private readonly element: ElementRef) {
    this.initialColor = this.element.nativeElement.style.borderColor;
    this.element.nativeElement.style.borderWidth = '2px';
  }

  @HostListener('mouseenter') onMouseEnter() {
    const color = getPokemonColor(this.pokemonType());
    this.setBorder(color);
  }

  @HostListener('mouseleave') onMouseLeave() {
    const color = this.initialColor;
    this.setBorder(color);
  }

  private setBorder(color: string) {
    this.element.nativeElement.style.borderColor = color;
  }
  
}
