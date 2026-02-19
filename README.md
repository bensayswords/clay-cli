# Clay CLI

A command-line interface for [Clay](https://clay.earth) (Personal Relationship Manager), wrapping the official MCP server.

## Features

- 🔍 **Search Contacts** - Find people in your Clay network
- 👤 **Get Details** - Retrieve full contact profiles including notes
- 🛠️ **MCP Wrapper** - Direct access to all Clay MCP tools via CLI
- ⚡ **Fast** - Bypasses complex agent setups for direct access

## Installation

```bash
npm install -g @bencollins/clay-cli
```

Or run directly:

```bash
npx @bencollins/clay-cli search "Dom Bilkey"
```

## Configuration

Requires a Clay API key. Set it as an environment variable:

```bash
export CLAY_API_KEY="your_key_here"
```

## Usage

### Search Contacts

```bash
clay search "Dom Bilkey"
clay search "Designers in London"
```

### Get Contact Details

```bash
clay get <contact_id>
```

### List Available Tools

```bash
clay list-tools
```

## License

MIT
