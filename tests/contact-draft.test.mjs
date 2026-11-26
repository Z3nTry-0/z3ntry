import assert from "node:assert/strict";
import test from "node:test";
import { buildContactDraft } from "../src/features/contact/data/contact-email.ts";

test("contact opens a draft with an encoded body and a fixed recipient", () => {
  const url = new URL(buildContactDraft("Ana", "ana@example.com", "Hola & adiós\n¿Nos vemos?"));
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "contact@z3ntry.com");
  assert.deepEqual([...url.searchParams.keys()], ["subject", "body"]);
  assert.equal(url.searchParams.get("body"), "Hola & adiós\r\n¿Nos vemos?\r\n\r\nNombre: Ana\r\nCorreo: ana@example.com");
});
