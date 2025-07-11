# CSP Evaluator CLI

A thin command‑line wrapper around Google’s [csp‑evaluator](https://github.com/google/csp-evaluator) library. Feed it a Content‑Security‑Policy string (from a header or meta tag) and it prints a JSON report rating your policy’s robustness.

---

## Features

* 🤏 **Zero‑config** – just pass a CSP string, file, or stdin
* 🐳 **Docker‑ready** – run without Node on your host
* 📦 **ESM** – modern import/export syntax
* 💚 **Lightweight** – Alpine base image, production deps only

---

## Quick start

### 1. Local usage (Node ≥ 20)

```bash
npm install --global csp-evaluator-cli   # after you publish

# Evaluate an inline policy
csp-eval -c "script-src 'self' https://cdn.example.com"

# Evaluate from a file
csp-eval -f ./csp.txt

# Or pipe
curl -s https://example.com | grep -i "content-security-policy" | awk -F':' '{print $2}' | csp-eval
```

<details>
<summary>Sample output</summary>

```json
{
  "score": 85,
  "warnings": [
    {
      "type": "NONCE_LENGTH",
      "severity": "HIGH",
      "description": "Nonces should be at least 8 bytes"
    }
  ],
  "syntax": "OK"
}
```

</details>

### 2. Docker

```bash
# Build the image (or pull ghcr.io/yourname/csp-eval:latest once published)
docker build -t csp-eval .

# Run it just like the CLI
docker run --rm csp-eval -c "default-src 'none'; script-src https://cdn.example.com"

# Mount a file
docker run --rm -v $(pwd):/work -w /work csp-eval -f ./csp.txt
```

---

## CLI options

| Flag        | Alias | Description                       |
| ----------- | ----- | --------------------------------- |
| `--csp`     | `-c`  | CSP string to evaluate            |
| `--file`    | `-f`  | Path to a file containing the CSP |
| `--help`    | `-h`  | Show usage information            |
| `--version` | `-V`  | Show version                      |

If none of `--csp` or `--file` is provided, the tool falls back to **stdin**.

---

## Installation from source

```bash
git clone https://github.com/yourname/csp-evaluator-cli.git
cd csp-evaluator-cli
npm install
npm link  # adds 'csp-eval' to your PATH
```

---

