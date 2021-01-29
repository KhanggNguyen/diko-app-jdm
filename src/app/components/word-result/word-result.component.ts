import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router, Params } from "@angular/router";
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
  eid;
  isLoading = true;
  constructor(
    private wordService: WordService,
    private route: ActivatedRoute,
    private titleService: Title,
    private router: Router
  ) {}

  ngOnInit() {
    let motif = "";
    let rel = "";
    
    this.route.queryParams.subscribe((params) => {
      
      if (params.word && params.rel) {
        this.isLoading = true;
        motif = params.word;
        rel = params.rel;
        this.wordService
          .sendGetRequest(params.word, params.rel)
          .subscribe((data: []) => {
            this.eid = data["eid"].eid;
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
        this.isLoading = true;
        this.setTitle(params["word"]);
        this.wordService
          .sendGetRequest(params["word"], "")
          .subscribe((data: []) => {
            this.eid = data["eid"].eid;
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

  getNameFromEid(r_node2: string): string{
    let name = "";
    this.ent_type.map( (et) => {
      if(et["eid"] == r_node2 && et["name"]){
        name = et["name"];
      }
    });
    return name;
  }

  getFormatedNameFromEid(r_node2: string): string{
    let name = "";
    this.ent_type.map( (et) => {
      if(et["eid"] == r_node2 && et["formated_name"]){
        if(this.requireFormatedName(et["name"])){
          name = et["formated_name"];
        }
      }else if(et["eid"] == r_node2 && !et["formated_name"] && et["name"]){
        name = et["name"];
      }
    });
    return name;
  }

  requireFormatedName(entite: string) {
    return /\d/.test(entite);
  }

  convertToFormatedName(r_node2: string) : string{
    let name = this.getNameFromEid(r_node2);
    let formated_name = this.getFormatedNameFromEid(r_node2);
    this.ent_type.map((rt) => {
      let str = rt["name"];
      if (str == name && rt["formated_name"]) {
        formated_name = rt["formated_name"].substring(
          1,
          rt["formated_name"].length - 1
        );
      }
    });
    return formated_name;
  }

  parserFormatedName(r_node2: string) {
    let name = this.getNameFromEid(r_node2);
    let formatedName = this.getFormatedNameFromEid(r_node2);
    this.ent_type.map((rt) => {
      let str = rt["name"];
      if (str == name && rt["formated_name"]) {
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

  parserCategoryName(r_node2: string) {
    let name = this.getNameFromEid(r_node2);
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
