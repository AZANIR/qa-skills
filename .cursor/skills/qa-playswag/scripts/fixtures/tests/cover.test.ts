import { test } from "@playwright/test";

test("hits users with base path", async ({ request }) => {
  await request.get("/api/v1/users");
});
