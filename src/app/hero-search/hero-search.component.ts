import { Component, OnInit } from '@angular/core';
import { debounceTime, distinct, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroServive: HeroService) {

  }

  // ajoute un terme dans la liste de termes
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // attends 300ms après chaque saisie avant d'effectuer l'action
      debounceTime(300),
      // ignore le nouveau term si c'est le même qu'avant
      distinctUntilChanged(),
      // actualise la liste à chaque nouvelle entrée
      switchMap((term: string) => this.heroServive.searchHeroes(term))
    );
  }
}
