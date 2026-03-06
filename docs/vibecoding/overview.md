# Vibe Coding Overview

---

## Why AI-Assisted Development

AI-assisted development has become an irreversible trend. In the DejaOS ecosystem, we can fully leverage large language models to assist development, or even achieve an **entirely AI-driven** application development workflow.

We have practiced with **Cursor**, **Claude Code**, and various LLMs to try and validate the feasibility of "full AI development." This documentation series is based on those practices and helps you implement features on DejaOS more efficiently and accurately with AI.

---

## How DejaOS Differs from Web/Node.js

DejaOS JavaScript development differs in several ways from typical Web front-end or Node.js development:

- **Runtime**: Code runs on embedded devices, relying on DejaOS runtime and module system (e.g. `dxmodules`), not a browser or Node environment.
- **APIs and modules**: Uses DejaOS native modules (e.g. `dxUi`, `dxGpio`), with different naming, usage, and constraints from the Web/Node ecosystem.
- **Project structure**: Influenced by `app.dxproj`, device model, and component versions; project layout differs from typical front-end projects.

Using prompts or context meant for "writing Web/Node apps" often leads to code that does not match DejaOS conventions. We provide **reference prompt documentation** so you can inject the right context and constraints into the conversation and have the AI generate runnable DejaOS code quickly and accurately.

---

## What This Documentation Series Offers

- **[Prompts](./prompts.md)**: Reusable (or lightly customized) prompt templates for common scenarios (UI layout, device connection, business logic, etc.), so you can get DejaOS-compliant implementations quickly in Cursor, Claude Code, and similar tools.
- **[UI Manager](./uimanager.md)**: DejaOS UI and Vibe Coding guidance to help both AI and developers understand screen structure, component usage, and best practices.

With these docs, you can get the model to "understand" DejaOS boundaries and conventions faster and reduce unnecessary output and back-and-forth edits.

---

## Reference: AI-Built Apps and Samples

On our site, **[Apps & Samples](https://dejaos.com/apps/welcome/)**, many sample applications are built with AI assistance or entirely by AI. They cover:

- **Features**: Demos showing multiple modules working together.
- **Solutions**: More complete, near-production scenario examples.

You can use these as a reference for what AI can do on DejaOS and, together with the prompts and conventions in this series, reproduce or extend similar capabilities in your own projects. **The prompt documentation will be updated continuously, and corresponding AI-generated app samples will be released on an ongoing basis**—stay tuned.

---

Start with **[Prompts](./prompts.md)** to plug DejaOS best practices into your existing AI development workflow.
