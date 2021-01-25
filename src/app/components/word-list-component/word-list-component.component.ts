import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Params } from "@angular/router";
import { WordService } from "src/app/services/word.service";

@Component({
  selector: "app-word-list-component",
  templateUrl: "./word-list-component.component.html",
  styleUrls: ["./word-list-component.component.css"],
})
export class WordListComponentComponent implements OnInit {
  words = [];
  rel_type = [];
  ent_type = [];
  constructor(
    private wordService: WordService,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit() {
    
    this.route.params.subscribe((params: Params) => {
      if (params["word"] != undefined) {
        this.setTitle(params["word"]);
        this.wordService
          .sendGetWordsListRequest(params["word"])
          .subscribe( (data: []) => {
            this.words = data;
            this.wordService.sendMessage(data);       
          });
      }
    });

    this.route.queryParams.subscribe( (params) => {
      if(params.word && params.rel){
        this.setTitle(params.word);
        this.wordService
          .sendGetWordsListRefinement(params.word, params.rel)
          .subscribe( (data: []) => {
            this.words = data["entite_type"];
            this.rel_type = data["rel_type"];
            this.ent_type = data["entite_type"];
            this.wordService.sendMessage(data);
          })
      }
    })
    
    
  }

  convertToFormatedName(entite: string) {
    let formated_name = entite;
    this.words.map((rt) => {
      let str = rt["name"];
      if (str == entite && rt["formated_name"]) {
        formated_name = rt["formated_name"].substring(
          1,
          rt["formated_name"].length - 1
        );
      }
    });
    return formated_name;
  }

  parserFormatedName(entite: string) {
    let formatedName = entite;
    this.words.map((rt) => {
      if (formatedName == rt["name"] && rt["formated_name"]) {
        formatedName = rt["formated_name"].substring(
          1,
          rt["formated_name"].length - 1
        );

        
      }
    });

    if (formatedName.includes(">")) {
      formatedName = formatedName.replace(/>/g, "(").replace(/:/g, " ") + ")";
    }

    formatedName = formatedName.replace(/Ver/g, "Verbe");
    formatedName = formatedName.replace(/Adj/g, "Adjectif");
    formatedName = formatedName.replace(/SG/g, "Singulier");
    formatedName = formatedName.replace(/Mas/g, "Masculin");
    formatedName = formatedName.replace(/Fem/g, "Feminin");

    return formatedName;
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
