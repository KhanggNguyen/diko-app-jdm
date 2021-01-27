import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Params } from "@angular/router";
import { WordService } from "../../services/word.service";
import * as $ from 'jquery';

@Component({
  selector: "app-word-result",
  templateUrl: "./word-result.component.html",
  styleUrls: ["./word-result.component.css"],
})
export class WordResultComponent implements OnInit {
  words = [];
  rel_type = [];
  ent_type = [];
  definition;
  isLoading = true;
  constructor(
    private wordService: WordService,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit() {
    let motif = "";
    let rel = "";
    
    $(".container").clear();

    this.route.queryParams.subscribe((params) => {
      if (params.word && params.rel) {
        motif = params.word;
        rel = params.rel;
        this.wordService
          .sendGetRequest(params.word, params.rel)
          .subscribe((data: []) => {
            this.words = data["rel"];
            this.rel_type = data["rel_type"];
            this.ent_type = data["entite_type"];
            this.definition = data["definition"]["def"];
            this.wordService.sendMessage(data);
            this.isLoading = false;
          });
      }
    });

    this.route.params.subscribe((params: Params) => {
      if (params["word"] != undefined) {
        this.setTitle(params["word"]);
        this.wordService
          .sendGetRequest(params["word"], "")
          .subscribe((data: []) => {
            this.words = data["rel"];
            this.rel_type = data["rel_type"];
            this.ent_type = data["entite_type"];
            this.definition = data["definition"]["def"];
            this.wordService.sendMessage(data);
            this.isLoading = false;
          });
      }
    });
  }

  containsRelationType(rel) {
    let exists = false;
    this.rel_type.map((rt) => {
      if (rel == rt["rtid"]) exists = rel == rt["rtid"];
    });
    let hasWeightPositive = false;
    if (exists) {
      this.words.map((r) => {
        if (r["r_type"] == rel && r["poids"] > 0) {
          hasWeightPositive = true;
        }
      });
    }

    return hasWeightPositive;
  }

  requireFormatedName(entite: string) {
    return /\d/.test(entite);
  }

  convertToFormatedName(entite: string) {
    let formated_name = entite;
    this.ent_type.map((rt) => {
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
    this.ent_type.map((rt) => {
      let str = rt["name"];
      if (str == entite && rt["formated_name"]) {
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

  parserCategoryName(name: string) {
    let newName = name.replace(/:/g, " ");
    newName = newName.replace(/Ver/g, "Verbe");
    newName = newName.replace(/Adj/g, "Adjectif");
    newName = newName.replace(/Inf/g, "infinitif");
    newName = newName.replace(/SG/g, "Singulier");
    newName = newName.replace(/Mas/g, "Masculin");
    newName = newName.replace(/Fem/g, "Feminin");
    return newName;
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
