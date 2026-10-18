# GitHub Pages deployment

The website entry point is `dist/index.html`. The included Actions workflow publishes the contents of `dist/`, so the rest of the repository is not served as the website.

## Enable publishing

1. Push this project, including `.github/workflows/deploy-pages.yml`, to the repository's `main` branch.
2. Open the repository's **Settings > Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open **Actions > Deploy website to GitHub Pages** and choose **Run workflow** if a run has not already started.
5. Wait for the deployment job to succeed. Its environment link opens the published website.

For `cmourelatos21/psaltis-car-painting`, the expected address is:

https://cmourelatos21.github.io/psaltis-car-painting/

Every later push to `main` checks and republishes the website. Existing relative asset links support this repository subdirectory without changes.

## If deployment fails

Open the failed run in **Actions** and inspect the failing step. A Pages configuration error usually means the repository's Pages source still needs to be set to **GitHub Actions**. A 404 before a successful deployment does not establish a problem with the website files.

GitHub's documentation: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
