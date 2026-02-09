import { TestBed } from "@angular/core/testing";
import { Index } from "./index";

describe("Index", () => {
  it("should render label", async () => {
    const fixture = TestBed.createComponent(Index);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("label")?.textContent).toContain(
      "Rechercher",
    );
  });
});
