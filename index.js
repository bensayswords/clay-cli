#!/usr/bin/env node

const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');

const program = new Command();

program
  .name('clay')
  .description('CLI wrapper for Clay MCP')
  .version('1.0.0');

async function getClient() {
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['@clayhq/clay-mcp@latest'],
    env: {
      ...process.env,
      CLAY_API_KEY: process.env.CLAY_API_KEY || '72efcdc836cb6d59bf3e26669c64fcb051b98c04ad4d0e79d05df55ecb971172'
    }
  });

  const client = new Client(
    { name: 'clay-cli', version: '1.0.0' },
    { capabilities: {} }
  );

  await client.connect(transport);
  return client;
}

program
  .command('search <query>')
  .description('Search for contacts')
  .action(async (query) => {
    try {
      const client = await getClient();
      const result = await client.callTool({
        name: 'searchContacts',
        arguments: { query }
      });
      
      console.log(JSON.stringify(result.content, null, 2));
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:', error.message));
      process.exit(1);
    }
  });

program
  .command('get <id>')
  .description('Get contact details')
  .action(async (id) => {
    try {
      const client = await getClient();
      const result = await client.callTool({
        name: 'getContact',
        arguments: { id }
      });
      
      console.log(JSON.stringify(result.content, null, 2));
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:', error.message));
      process.exit(1);
    }
  });

program
  .command('list-tools')
  .description('List available tools')
  .action(async () => {
    try {
      const client = await getClient();
      const result = await client.listTools();
      console.log(JSON.stringify(result.tools, null, 2));
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:', error.message));
      process.exit(1);
    }
  });

program.parse();
