import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
 })
export class AppComponent {
  

  // FIRST EXAMPLE
  // name = signal('Pikachu aka Jean-Luc');
  // imageSrc = signal('https://archives.bulbagarden.net/media/upload/thumb/4/4a/0025Pikachu.png/375px-0025Pikachu.png');
  // size = computed(() => {
  //   if (this.life() < 16) {
  //     return "Petit";
  //   };
  //   if (this.life() > 24) {
  //     return "Grand";
  //   };
  //   return "Moyen";
  // })
  // life = signal(21);
  // incrementLife() {
  //   this.life.update((life) => life + 1)
  // }
  // decrementLife() {
  //   this.life.update((life) => life - 1)
  // }
}
