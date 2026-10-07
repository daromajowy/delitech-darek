import { writeFileSync, mkdirSync } from "node:fs";
import { exampleProject } from "../src/model";
mkdirSync("qa-output", { recursive: true });
const p = exampleProject();
p.name = "TEST AUTOMATYCZNY KNX";
p.contact = "Test techniczny";
p.email = "test@example.invalid";
writeFileSync("qa-output/api-fixture.json", JSON.stringify(p));
