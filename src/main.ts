const { context } = require("@actions/github");
const core = require("@actions/core");

import isValidCommitMessage from "./isValidCommitMesage";
import extractCommits from "./extractCommits";

async function run() {
    core.info(
        `ℹ️ Checking if commit messages are following the Conventional Commits specification...`
    );

    const extractedCommits = await extractCommits(context, core);
    if (extractedCommits.length === 0) {
        core.info(`No commits to check, skipping...`);
        return;
    }

    let hasErrors;
    core.startGroup("Commit messages:");
    for (let i = 0; i < extractedCommits.length; i++) {
        let commit = extractedCommits[i];
        if (isValidCommitMessage(commit.message)) {
            core.info(`✅ ${commit.message}`);
        } else {
            core.info(`🚩 ${commit.message}`);
            hasErrors = true;
        }
    }
    core.endGroup();

    if (hasErrors) {
        const message = 'According to the conventional-commits specification, some of the commit messages are not valid.';
        core.setOutput('error_message', message);
        core.setFailed(`🚫 ${message}`);
    } else {
        core.info("🎉 All commit messages are following the Conventional Commits specification.");
    }
}

run();
