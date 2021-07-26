import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  postPending: boolean = false;
  
  constructor(private http: HttpClient) {}

  ngOnInit(){
    this.filteredOptions = this.actorName.valueChanges.pipe(startWith(''), map(value => this.searchActor(value)));
    this.actors = [];
    this.matchedMovies = [];
  }

  async test() {
    this.postPending = true;
    this.matchedMovies = [];

    const ids: number[] = [];
    for(var i = 0; i < this.actors.length; i++) {
      ids.push(this.actors[i].id);
    }

    await this.http.post<Media[]>('http://localhost:5001/co-stars-qa/us-central1/api/movies', {
      ids: ids
    }).subscribe(result => {
      this.matchedMovies.push(...result);
    });

    this.postPending = false;
  }

  searchActor(text: string): Actor[] {
    
    if(typeof(text) === 'object') {
      this.getActor(text);
      return [];
    }

    const enteredValue = text.replace(/[^0-9a-z ]/gi, '');
    
    if(enteredValue.length < 3) {
      return [];
    }

    var results: Actor[] = [];

    this.http.get<Actor[]>(`http://localhost:5001/co-stars-qa/us-central1/api/person?name=${enteredValue}`).subscribe(result => {
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

    this.actorName.setValue('');

    const foundResult = this.actors.filter(p => p.id === actor.id);

    console.log(foundResult);

    if(foundResult?.length > 0)
      return;

    this.actors.push(actor);
  }
}
