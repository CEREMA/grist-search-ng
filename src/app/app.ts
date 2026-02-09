import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ButtonDemo } from "./components/button-demo";

@Component({
  selector: "app-root",
  imports: [ButtonDemo, RouterOutlet],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  protected readonly title = signal("grist-search-ng");
}
