<div align="center">
<h1>DZ Opstellingen</h1>

<p>Sanity tool to simplify the creation of badminton match setups for local competition..</p>
</div>

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [☕ Setup](#-setup)
  - [Sanity](#sanity)
    - [Config](#config)
- [🚀 Deployment](#-deployment)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# ☕ Setup

Install node_modules with `npm install`.

## Sanity
If you don't have the [Sanity CLI](https://www.sanity.io/docs/getting-started-with-sanity-cli) installed, install it globally using `npm install -g @sanity/cli`.

1. `sanity init`
2. During Sanity's initalization it will warn you, type `Y` and hit `enter`:
    ```
    ? The current folder contains a configured Sanity studio. Would you like to reconfigure it? (Y/n)
    ```
4. When it asks you what dataset configuration to use, go with `production`.
5. Add CORS Origins to your newly created Sanity project (visit: [manage.sanity.io](https://manage.sanity.io) and go to Settings > API):
    - Add your Studio URLs **_with_** credentials: `http://localhost:3333` and `[subdomain].sanity.studio`

> ⚠️ **Important!** <br />For "singleton" documents, like settings sections, the schema uses `__experimental_actions`. You will need to comment out the `__experimental_actions` line in "singleton" schemas to publish settings for the first time. This is because a singleton is still a document type, and one needs to exist first before it can be edited. If you create a new singleton document. You need to add it to the list of singletons at `studio/parts/resolve-actions`

### Config

1. Run `cp .env.example .env.development` file in the project folder.
2. Update all the `xxxxxx` values, here's where to find each:

  - `SANITY_STUDIO_API_PROJECT_ID` - You can grab this from your Sanity Manage dashboard
  - `SANITY_STUDIO_API_DATASET` - Chose this on init

# 🚀 Deployment

You can simply run `npm run deploy` from the project folder. Select a subdomain you want; your Studio is now accessible from the web.

> ⚠️ **Important!** <br />Deploy takes `.env.production` so make sure it exists.

