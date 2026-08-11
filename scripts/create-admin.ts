import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });

  console.log("Criar usuário administrador do painel MS Móveis\n");

  const name = (await rl.question("Nome: ")).trim();
  const email = (await rl.question("E-mail: ")).trim().toLowerCase();
  const password = await rl.question("Senha (mín. 8 caracteres): ");

  rl.close();

  if (!name || !email) {
    console.error("\nNome e e-mail são obrigatórios.");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("\nA senha precisa ter pelo menos 8 caracteres.");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.error(`\nJá existe um usuário com o e-mail ${email}.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: "ADMIN", active: true },
  });

  console.log(`\nUsuário administrador criado: ${user.email}`);

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
