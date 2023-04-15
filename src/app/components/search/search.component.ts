import { Component, OnInit, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { SearchOption } from "src/app/models/search-option.model";
import { WordService } from "src/app/services/word.service";


@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchComponent implements OnInit {
  words = [];
  searchValue : string = "";
  defaultOption : string = "-1";
  searchOption : string = this.defaultOption;
  searchOptions : SearchOption[] = [
    {r_id: '-1', label: 'Recherche la forme' },
    {r_id: '0', label: 'Recherche mots associés (r_associated)' },
    {r_id: '4', label:'Recherche les catégories (r_pos)'},
    {r_id: '5', label: 'Recherche mots synonymes (r_syn)'},
    {r_id: '6', label: 'Recherche mots générique (r_isa)'},
    {r_id: '2000', label:'Recherche des raffinements de sens'}

  ];
  constructor(private route: ActivatedRoute, private router: Router, private wordService: WordService) {}

  ngOnInit() {
    let regex = "[#]";
    this.route.queryParams
      .subscribe(params => {
        if(params.word){
          this.searchValue = params.word;
        }
        if(params.rel){
          this.searchOption = params.rel;
        }
      });

    if(this.searchOption == '-1' && this.searchValue){
      if (this.searchValue.match(regex)) {
        this.router.navigate(["/find/list/" + this.searchValue]);
      } else {
        this.router.navigate(["/find/definition/" + this.searchValue]);
      }
    }else if(this.searchOption == '2000' && this.searchValue){
      this.router.navigate(["/find/list"], {queryParams: {word: this.searchValue, rel: this.searchOption} });
    }else if (this.containsOption(this.searchOption) && this.searchValue){
      this.router.navigate(["/find/definition"], {queryParams: {word: this.searchValue, rel: this.searchOption} });
    }else if (!this.containsOption(this.searchOption)){
      this.router.navigate(["error404/"]);
    }
  }

  onSubmit(f: NgForm) {
    let regex = "[#]";
    if(this.searchOption == '-1' && this.searchValue){
      if (f.value.searchValue.match(regex)) {
        this.router.navigate(["/find/list/" + f.value.searchValue]);
      } else {
        this.router.navigate(["/find/definition/" + f.value.searchValue]);
      }
    }else if(this.searchOption == '2000' && this.searchValue){
      this.router.navigate(["/find/list"], {queryParams: {word: f.value.searchValue, rel: f.value.searchOption} });
    }else if (this.containsOption(this.searchOption) && this.searchValue){
      this.router.navigate(["/find/definition"], {queryParams: {word: f.value.searchValue, rel: f.value.searchOption} })
    }else{
      this.router.navigate(["error404/"]);
    }
  }

  onChange(event: any): void {
      /*
      if (this.searchValue.length >= 4) {
        this.wordService.getWords(this.searchValue).subscribe((data: []) => {
          this.words = data;
        });
      }
      */
    
  }

  containsOption(r_id: String){
    let exists = false;
    for(var so of this.searchOptions){
      if(so.r_id == r_id)
        exists = true;
    }
    return exists;
  }
}
