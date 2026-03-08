#!/usr/bin/env node

import { program } from 'commander';

const initCmd = program
  .name('qa-skills')
  .description('QA Skills Ecosystem — install agent skills into Cursor, Claude Code, Codex, and more')
  .version('3.0.0');

initCmd
  .command('init', { isDefault: true })
  .description('Initialize QA skills in your project (default command)')
  .option('-a, --agent <agents...>', 'Target specific agents (e.g., cursor, claude-code)')
  .option('-s, --skill <skills...>', 'Install specific skills by name')
  .option('-g, --global', 'Install to user home directory instead of project')
  .option('--copy', 'Copy files instead of symlinking')
  .option('-y, --yes', 'Skip all confirmation prompts')
  .option('-l, --list', 'List available skills without installing')
  .action(async (opts) => {
    const { listSkills, runInteractive, runNonInteractive } = await import('../dist/installer.js');

    if (opts.list) {
      await listSkills();
    } else if (opts.yes || (opts.agent && opts.skill)) {
      await runNonInteractive({
        agents: opts.agent,
        skills: opts.skill,
        global: opts.global,
        copy: opts.copy,
        yes: opts.yes,
      });
    } else {
      await runInteractive({
        agents: opts.agent,
        skills: opts.skill,
        global: opts.global,
        copy: opts.copy,
      });
    }
  });

program.parse();
