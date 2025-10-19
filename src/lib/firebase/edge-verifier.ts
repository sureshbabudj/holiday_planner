import { decodeProtectedHeader, importX509, jwtVerify } from "jose";

const EMU_BASE = "http://localhost:9099/identitytoolkit.googleapis.com/v1";
const GOOGLE_PUB_KEYS_URL =
  "https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys";

export async function verifyEmulatorToken(token: string) {
  const res = await fetch(`${EMU_BASE}/accounts:lookup?key=fake-api-key`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken: token }),
  });
  if (!res.ok) throw new Error("invalid token");
  const json = await res.json();
  return json.users?.[0] ?? {};
}

export async function verifyProductionToken(token: string) {
  const protectedHeader = decodeProtectedHeader(token);

  if (protectedHeader.alg !== "RS256" || !protectedHeader.kid) {
    return null;
  }

  // Fetch public keys
  const publicKeysResponse = await fetch(GOOGLE_PUB_KEYS_URL);
  const publicKeysData = await publicKeysResponse.json();

  // Get the correct public key
  const x509 = publicKeysData[protectedHeader.kid];
  const { alg } = protectedHeader;

  // Validate and fetch the payload
  const ecPublicKey = await importX509(x509, alg);
  const { payload } = await jwtVerify(token, ecPublicKey);

  return payload;
}
