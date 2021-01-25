import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {WordService} from '../../services/word.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  words;

  constructor(private wordService: WordService,
    private titleService: Title) { 
    this.words = wordService.getMessage().subscribe(data => {
      if(data){
        this.words = data;
        
      }else{
        this.words = [];
      }
    });
    wordService.clearMessages();
  }

  ngOnInit() {
    this.setTitle();

  }


  public setTitle() {
    this.titleService.setTitle("Home");
  }
}
