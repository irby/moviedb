import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, interval } from 'rxjs';
import { map, startWith, debounce } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Actor } from './models/actor.model';
import { Media } from './models/media.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  actorName = new FormControl();
  title = `moviedb-spa ${environment.name}`;
  filteredOptions!: Observable<Actor[]>;
  actors!: Actor[];
  matchedMovies!: Media[];
  movieMatchCompleted: boolean = false;
  isSearchPending: boolean = false;
  MAX_LIMIT: number = 10;
  
  constructor(private http: HttpClient) {}

  ngOnInit(){
    this.filteredOptions = this.actorName.valueChanges.pipe(startWith(''), debounce(() => interval(200)), map(value => this.searchActor(value)));
    this.actors = [];
    this.matchedMovies = [];
  }

  async findMatchedMovies() {
    this.movieMatchCompleted = false;
    this.isSearchPending = true;
    this.matchedMovies = [];

    const ids: number[] = [];
    for(var i = 0; i < this.actors.length; i++) {
      ids.push(this.actors[i].id);
    }

    await this.http.post<Media[]>(`${environment.apiUrl}movies`, {
      ids: ids
    }).subscribe(result => {
      this.matchedMovies.push(...result);
      this.movieMatchCompleted = true;
      this.isSearchPending = false;
    });
  }

  searchActor(text: string): Actor[] {

    this.movieMatchCompleted = false;
    
    if(typeof(text) === 'object') {
      this.getActor(text);
      return [];
    }

    const enteredValue = text.replace(/[^0-9a-z ]/gi, '');
    
    if(enteredValue.length < 3) {
      return [];
    }

    var results: Actor[] = [];

    this.http.get<Actor[]>(`${environment.apiUrl}person?name=${enteredValue}`).subscribe(result => {
      for(var i = 0; i < result.length; i++) {
        results.push(result[i]);
      }
    });

    return results;
  }

  getActor(actorData: any) {
    const actor = actorData as Actor;
    
    if(actor === null)
      return;

    const foundResult = this.actors.filter(p => p.id === actor.id);

    if(foundResult?.length > 0) {
      alert('The entry you\'ve provided is already in the list');
      return;
    }
      

    if(this.actors.length >= this.MAX_LIMIT) {
      alert('Maximum number of entries has been reached. Please remove some entries to add this one in');
      return;
    }

    this.actorName.setValue('');

    this.matchedMovies = [];

    this.actors.push(actor);
  }

  getOptionText(option: any) {
    return option ? option.name : null;
  }

  deleteActor(id: number) {
    this.movieMatchCompleted = false;
    const actor = this.actors.find(p => p.id === id) as Actor;
    this.actors.splice(this.actors.indexOf(actor),1);
    this.matchedMovies = [];
  }

  clear(){
    this.actors = [];
    this.matchedMovies = [];
    this.movieMatchCompleted = false;
    this.actorName.setValue('');
  }

  parseYear(releaseDate: string) : string {
    const date = new Date(releaseDate);
    return !isNaN(date.getFullYear()) ? date.getFullYear().toString() : "????";
  }
}
