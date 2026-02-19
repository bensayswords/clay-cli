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
  .command('note <id> <content>')
  .description('Add a note to a contact')
  .action(async (id, content) => {
    try {
      const client = await getClient();
      const result = await client.callTool({
        name: 'createNote',
        arguments: { contact_id: parseInt(id), content }
      });
      console.log(JSON.stringify(result.content, null, 2));
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:', error.message));
      process.exit(1);
    }
  });

program
  .command('group-list')
  .description('List all groups')
  .action(async () => {
    try {
      const client = await getClient();
      const result = await client.callTool({
        name: 'getGroups',
        arguments: {}
      });
      console.log(JSON.stringify(result.content, null, 2));
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:', error.message));
      process.exit(1);
    }
  });

program
  .command('group-create <title>')
  .description('Create a new group')
  .action(async (title) => {
    try {
      const client = await getClient();
      const result = await client.callTool({
        name: 'createGroup',
        arguments: { title }
      });
      console.log(JSON.stringify(result.content, null, 2));
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:', error.message));
      process.exit(1);
    }
  });

program
  .command('group-update <id>')
  .description('Update group (add/remove members)')
  .option('--title <title>', 'New title')
  .option('--add <ids>', 'Comma-separated contact IDs to add')
  .option('--remove <ids>', 'Comma-separated contact IDs to remove')
  .action(async (id, options) => {
    try {
      const args = { group_id: parseInt(id) };
      if (options.title) args.title = options.title;
      if (options.add) args.add_contact_ids = options.add.split(',').map(i => parseInt(i.trim()));
      if (options.remove) args.remove_contact_ids = options.remove.split(',').map(i => parseInt(i.trim()));

      const client = await getClient();
      const result = await client.callTool({
        name: 'updateGroup',
        arguments: args
      });
      console.log(JSON.stringify(result.content, null, 2));
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:', error.message));
      process.exit(1);
    }
  });

program
  .command('create-contact')
  .description('Create a new contact')
  .requiredOption('--email <email>', 'Email address')
  .option('--name <name>', 'Full name')
  .option('--linkedin <handle>', 'LinkedIn handle')
  .action(async (options) => {
    try {
      const args = { email: [options.email] };
      if (options.name) {
        const parts = options.name.split(' ');
        args.first_name = parts[0];
        args.last_name = parts.slice(1).join(' ');
      }
      if (options.linkedin) args.linkedin = options.linkedin;

      const client = await getClient();
      const result = await client.callTool({
        name: 'createContact',
        arguments: args
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
