// Limpeza do código Java antes de montar o prompt: remove comentários (//, /* */, javadoc),
// declarações `package`/`import` e linhas em branco repetidas. Respeita literais de texto/char/text block
// (um "//" dentro de string, como "http://x", NÃO é comentário). Mantém o resto do código intacto.
export function cleanJava(src: string): string {
  let out = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === "/" && d === "/") { // comentário de linha
      while (i < n && src[i] !== "\n") i++;
    } else if (c === "/" && d === "*") { // comentário de bloco: preserva quebras de linha como espaço
      i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2;
      out += " ";
    } else if (c === '"' && src.startsWith('"""', i)) { // text block
      const end = src.indexOf('"""', i + 3);
      const stop = end === -1 ? n : end + 3;
      out += src.slice(i, stop);
      i = stop;
    } else if (c === '"' || c === "'") { // string / char
      let j = i + 1;
      while (j < n && src[j] !== c && src[j] !== "\n") j += src[j] === "\\" ? 2 : 1;
      out += src.slice(i, j + 1);
      i = j + 1;
    } else {
      out += c;
      i++;
    }
  }
  return out
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .filter((l) => !/^\s*(package|import)\s+[\w.*\s]+;\s*$/.test(l))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim() + "\n";
}
