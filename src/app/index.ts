import { Component, effect, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import Fuse from "fuse.js";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";

interface SearchResult {
  name: string;
  score: number;
}

interface GristRow {
  titre: string;
  mots_cles: string;
  description: string;
}

@Component({
  templateUrl: "./index.html",
  imports: [FormsModule, ButtonModule, InputTextModule, TableModule],
})
export class Index {
  protected value = signal("");
  results: SearchResult[] = [];
  fuseSearch?: Fuse<GristRow>;

  constructor() {
    effect(() => {
      const v = this.value();
      if (!v || !this.fuseSearch) {
        this.results = [];
        return;
      }
      const results = this.fuseSearch.search(this.value());
      this.results = results.map((result) => {
        return {
          name: result.item.titre,
          score: Math.round((result.score || 1) * 1000) / 1000,
        };
      });
    });
    window.grist?.ready({
      allowSelectBy: true,
      requiredAccess: "read table",
    });

    window.grist?.onRecords((records: GristRow[]) => {
      if (!records) {
        return;
      }
      this.fuseSearch = new Fuse(records, {
        keys: [
          {
            name: "titre",
            weight: 1,
          },
          {
            name: "mots_cles",
            weight: 0.5,
          },
          {
            name: "description",
            weight: 0.1,
          },
        ],
        includeScore: true,
        ignoreDiacritics: true,
        ignoreLocation: true,
        // includeMatches: true,
      });
    });
  }
}
