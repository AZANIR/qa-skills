import { program } from 'commander';
import path from 'node:path';
import { runInteractive, runNonInteractive, listSkills, type InitOptions } from './commands/init.js';
import { runAdd } from './commands/add.js';
import { runDoctor } from './commands/doctor.js';
import { runSync } from './commands/sync.js';
import { runCheck } from './commands/check.js';

program
  .name('qa-skills')
  .description('QA Skills Ecosystem — install and manage agent skills')
  .version('3.1.1');

program
  .command('init', { isDefault: true })
  .description('Initialize QA skills in your project')
  .argument('[directory]', 'Target directory (defaults to current directory)')
  .option('-a, --agent <agents...>', 'Target specific agents (e.g., cursor, claude-code)')
  .option('-s, --skill <skills...>', 'Install specific skills by name')
  .option('-g, --global', 'Install to user home directory instead of project')
  .option('--copy', 'Copy files instead of symlinking')
  .option('-y, --yes', 'Skip all confirmation prompts')
  .option('-l, --list', 'List available skills without installing')
  .action(async (directory: string | undefined, opts: InitOptions) => {
    if (directory) {
      process.chdir(path.resolve(directory));
    }

    if (opts.list) {
      await listSkills();
    } else if (opts.yes || (opts.agents && opts.skills)) {
      await runNonInteractive(opts);
    } else {
      await runInteractive(opts);
    }
  });

program
  .command('add')
  .description('Add skills to an existing project')
  .argument('<skills...>', 'Skills to add (e.g., api-testing playwright-ts-writer)')
  .option('-a, --agent <agents...>', 'Target specific agents')
  .option('--copy', 'Copy files instead of symlinking')
  .action(async (skills: string[], opts: { agent?: string[]; copy?: boolean }) => {
    await runAdd(skills, opts);
  });

program
  .command('doctor')
  .description('Check installation health')
  .action(async () => {
    await runDoctor();
  });

program
  .command('sync')
  .description('Sync skills to latest versions')
  .option('--copy', 'Copy files instead of symlinking')
  .action(async (opts: { copy?: boolean }) => {
    await runSync(opts);
  });

program
  .command('check')
  .description('Validate skill configs and dependencies')
  .action(async () => {
    await runCheck();
  });

program.parse();
