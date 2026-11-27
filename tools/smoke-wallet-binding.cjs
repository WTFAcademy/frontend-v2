// Run with Playwright available to Node: node tools/smoke-wallet-binding.cjs [site-url]
const assert = require("node:assert/strict");
const { chromium } = require("playwright");

const site = new URL(process.argv[2] || "http://localhost:3000").origin;
const fixture = { id: 12345, username: "binding-fixture", nickname: "Binding fixture", wallet_address: "", avatar: "" };

// An extension that has previously granted this site access to its address.
function installReturningWallet() {
  const address = "0x0000000000000000000000000000000000000001";
  const provider = {
    on() {},
    removeListener() {},
    async request({ method }) {
      if (method === "eth_accounts") return [address];
      if (method === "eth_chainId") return "0x2105";
      throw Error("Unexpected wallet RPC: " + method);
    },
  };
  const info = {
    uuid: "7c5f5ad5-dcb8-4c0b-a35e-081f834d91b6",
    name: "Test Wallet",
    rdns: "io.academy.qa",
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
  };
  const announce = () => window.dispatchEvent(new CustomEvent("eip6963:announceProvider", { detail: { info, provider } }));
  window.ethereum = provider;
  window.addEventListener("eip6963:requestProvider", announce);
  announce();
}

async function check(browser, { member, mobile, connected }) {
  const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 } });
  try {
    if (member) await context.addCookies([{ name: "wtf_token", value: "fixture", url: site }]);
    if (connected) await context.addInitScript(installReturningWallet);
    await context.route("**/v1/user/profile", route => route.fulfill({ json: { code: 0, data: fixture } }));

    const page = await context.newPage();
    let loginRequests = 0;
    page.on("request", request => {
      if (/\/v1\/login\/(github|wallet)$/.test(request.url())) loginRequests++;
    });
    await page.goto(site + "/en/settings", { waitUntil: "domcontentloaded" });
    if (member) {
      await page.waitForFunction(name => document.querySelector("form input")?.value === name, fixture.nickname);
    } else {
      await page.getByRole("button", { name: /^log\s?in$/i }).first().waitFor();
    }

    await page.getByRole("button", { name: "Bind Wallet", exact: true }).click();
    const dialog = page.getByRole("dialog");
    const signIn = dialog.getByRole("button", { name: "Sign in", exact: true });
    const walletAction = dialog.getByRole("button", { name: connected ? "Sign & Bind" : "Connect", exact: true });
    await walletAction.waitFor();
    assert.equal(await walletAction.isEnabled(), member);
    assert.equal(await signIn.count(), member ? 0 : 1);
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await dialog.waitFor({ state: "hidden" });
    assert.equal((await context.cookies()).some(c => c.name === "wtf_token"), member);
    assert.equal(loginRequests, 0);
  } finally {
    await context.close();
  }
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN });
  try {
    for (const scenario of [
      { member: true },
      { member: true, mobile: true },
      { member: true, connected: true },
      { member: false },
    ]) {
      await check(browser, scenario);
      console.log("Passed wallet binding", scenario);
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
