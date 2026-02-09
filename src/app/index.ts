import { Component, effect, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";

interface SearchResult {
  name: string;
  score: number;
}

@Component({
  templateUrl: "./index.html",
  imports: [FormsModule, ButtonModule, InputTextModule, TableModule],
})
export class Index {
  protected value = signal("");
  results!: SearchResult[];

  constructor() {
    effect(() => {
      this.results = [
        {
          name: this.value(),
          score: Math.random(),
        },
        {
          name: "ko",
          score: Math.random(),
        },
      ];
    });
    window.grist.ready({
      allowSelectBy: true,
      requiredAccess: "read table",
    });

    window.grist.onRecords((records: []) => {
      alert(`record count ${records.length}`);
    });
  }
}
