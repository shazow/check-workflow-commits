import { readFile } from 'fs/promises';
import fetch from 'node-fetch';
import yaml from 'js-yaml';
import { info, setFailed } from '@actions/core';
import { create } from '@actions/glob';

const badString = 'js-spoofed-commit-warning-trigger';
const goodString = 'branches-list';

async function checkActionCommit(action) {
  const [repo, commit] = action.split('@');
  if (commit) {
    // Basic check if the commit looks like a hex string
    if (commit.length >= 6 && /^[0-9a-f]+$/.test(commit)) {
      const url = `https://github.com/${repo}/branch_commits/${commit}`;
      info(`Checking: ${repo}@${commit} ...`);

      try {
        const response = await fetch(url);
        const text = await response.text();

        if (text.includes(badString)) {
          setFailed(`Found commit that does not exist on claimed repo: ${commit}\nAction: ${action}`);
        } else if (text.includes(goodString)) {
          info('✅');
        } else {
          setFailed(`Commit did not load or got an unexpected result: ${commit}\nAction: ${action}`);
        }
      } catch (error) {
        setFailed(`Failed to fetch ${url}: ${error}`);
      }
    }
  }
}

async function run() {
  try {
    const globber = await create('.github/workflows/*.yml');
    const workflowPaths = await globber.glob();

    for (const workflowPath of workflowPaths) {
      const workflowYaml = await readFile(workflowPath, 'utf-8');
      const workflow = yaml.load(workflowYaml);

      for (const job of Object.values(workflow.jobs ?? {})) {
        if (job.uses) {
            await checkActionCommit(job.uses);
        }
        for (const step of job.steps ?? []) {
          if (step.uses) {
            await checkActionCommit(step.uses);
          }
        }
      }
    }
  } catch (error) {
    setFailed(error.message);
  }
}

run();
