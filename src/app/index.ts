import { Component, effect, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import Fuse from "fuse.js";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";

interface SearchResult {
  name: string;
  score: number;
  id: number;
  index: number;
  selected: boolean;
}

interface GristRow {
  titre: string;
  mots_cles: string;
  description: string;
  id: number;
}

@Component({
  templateUrl: "./index.html",
  imports: [FormsModule, ButtonModule, InputTextModule, TableModule],
})
export class Index {
  protected value = signal("");
  protected selected = signal(-1);
  protected results = signal<SearchResult[]>([]);
  fuseSearch?: Fuse<GristRow>;

  constructor() {
    effect(() => {
      const v = this.value();
      if (!v || !this.fuseSearch) {
        this.results.set([]);
        return;
      }
      const results = this.fuseSearch.search(this.value());
      this.results.set(
        results.map((result, i) => {
          return {
            name: result.item.titre,
            score: Math.round((result.score || 1) * 1000) / 1000,
            id: result.item.id,
            index: i,
            selected: false,
          };
        }),
      );
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
            weight: 0.1,
          },
          {
            name: "description",
            weight: 0.5,
          },
        ],
        includeScore: true,
        ignoreDiacritics: true,
        ignoreLocation: true,
        // includeMatches: true,
      });
    });
  }
  click(index: number) {
    const selected = this.selected();
    this.results.update((value) => {
      if (selected !== -1) {
        value[selected].selected = false;
      }
      value[index].selected = true;
      return value;
    });
    this.selected.set(index);
    window.grist.setCursorPos({ rowId: this.results()[index].id });
  }
}
