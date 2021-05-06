import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import {SearchForm1} from '../search-form1';
import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
@Injectable()
export class ResultsComponent implements OnInit {



	
  constructor(private http:HttpClient) { }

  ngOnInit() {
  }

}
