import argon2 from "argon2";

export async function makeHash(value: string) {
  const hash = await argon2.hash(value);

  return hash;
}

export async function verifyHash(hash: string, matcher: string) {
  const flag = await argon2.verify(hash, matcher);

  return flag;
}
